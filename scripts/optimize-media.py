#!/usr/bin/env python3
"""Create web-ready copies without altering original photographs or videos.

Requires Pillow. Video conversion requires FFmpeg (FFMPEG_EXE environment
variable, ffmpeg on PATH, or the optional imageio-ffmpeg Python package).
"""

import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts/media-manifest.json"
OUTPUT = ROOT / "assets/optimized"
SETTINGS = b"adaz-web-v1:1600px-webp82-schema-lossless:1280px-h264-crf24-aac96"


def referenced_media():
    paths = set()
    for source in [*ROOT.glob("*.html"), ROOT / "script.js", ROOT / "styles.css"]:
        paths.update(re.findall(r"assets/[\w./-]+\.(?:png|jpe?g|webp|mp4)", source.read_text()))
    # These catalogue paths are constructed at runtime.
    for directory in ["geamuri", "volets"]:
        paths.update(str(p.relative_to(ROOT)) for p in (ROOT / "assets/catalogue" / directory).rglob("*.webp"))
    if MANIFEST.exists():
        paths.update(json.loads(MANIFEST.read_text())["media"])
    return sorted(path for path in paths if not path.startswith("assets/optimized/"))


def destination(source, extension):
    settings = SETTINGS + (b":home-q72-responsive768" if source.parent.name == "home" else b"")
    digest = hashlib.sha256(source.read_bytes() + settings).hexdigest()[:12]
    relative = source.relative_to(ROOT / "assets")
    path = OUTPUT / relative.parent / f"{relative.stem}.{digest}{extension}"
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def save_webp(image, path, *, lossless=False, quality=82):
    image.save(path, "WEBP", quality=quality, method=6, lossless=lossless)


def optimize_image(source):
    path = destination(source, ".webp")
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        is_schema = "schema" in source.stem.lower()
        quality = 72 if source.parent.name == "home" else 82
        max_size = 800 if source.parent.name == "brand" else 1600
        if not is_schema:
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        if not path.exists():
            save_webp(image, path, lossless=is_schema, quality=quality)
        # Avoid degrading already efficient WebP images for negligible savings.
        if source.suffix.lower() == ".webp" and image.size == original.size and path.stat().st_size >= source.stat().st_size * 0.9:
            shutil.copy2(source, path)
        record = {
            "path": str(path.relative_to(ROOT)),
            "width": image.width,
            "height": image.height,
            "originalBytes": source.stat().st_size,
            "bytes": path.stat().st_size,
        }
        variants = []
        if any(folder in source.parts for folder in ["about", "projets", "services", "home"]) and image.width > 960:
            for width in ([480, 768, 960] if source.parent.name == "home" else [480, 960]):
                variant = path.with_name(f"{path.stem}-{width}w.webp")
                if not variant.exists():
                    resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
                    save_webp(resized, variant, quality=quality)
                variants.append({"path": str(variant.relative_to(ROOT)), "width": width})
        record["variants"] = variants
        return record


def find_ffmpeg():
    executable = os.environ.get("FFMPEG_EXE") or shutil.which("ffmpeg")
    if executable:
        return executable
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as error:
        raise RuntimeError("Install FFmpeg or imageio-ffmpeg to optimize videos.") from error


def video_duration(ffmpeg, path):
    probe = subprocess.run([ffmpeg, "-hide_banner", "-i", str(path)], capture_output=True, text=True)
    match = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", probe.stderr)
    if not match:
        raise RuntimeError(f"Cannot read video duration: {path}")
    hours, minutes, seconds = map(float, match.groups())
    return hours * 3600 + minutes * 60 + seconds


def optimize_video(source, ffmpeg):
    path = destination(source, ".mp4")
    duration = video_duration(ffmpeg, source)
    if not path.exists():
        temporary = path.with_name(path.stem + ".encoding.mp4")
        # A duration-aware rate cap leaves room for audio/container overhead below 25 MiB.
        max_rate = min(4000, max(100, int(20 * 1024 * 1024 * 8 / duration / 1000) - 160))
        command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                   "-map", "0:v:0", "-map", "0:a:0?", "-vf",
                   "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30",
                   "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-maxrate", f"{max_rate}k",
                   "-bufsize", f"{max_rate * 2}k", "-pix_fmt", "yuv420p", "-threads", "2",
                   "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(temporary)]
        subprocess.run(command, check=True)
        if temporary.stat().st_size >= 25 * 1024 * 1024:
            temporary.unlink()
            raise RuntimeError(f"Video still exceeds the Cloudflare Pages limit: {source}")
        temporary.replace(path)
    if abs(video_duration(ffmpeg, path) - duration) > 0.15:
        raise RuntimeError(f"Video duration changed unexpectedly: {source}")
    return {"path": str(path.relative_to(ROOT)), "duration": duration,
            "originalBytes": source.stat().st_size, "bytes": path.stat().st_size}


def create_icons():
    source = ROOT / "assets/brand/adaz-renov-logo.png"
    records = {}
    with Image.open(source) as image:
        for name, size in [("favicon.png", 32), ("apple-touch-icon.png", 180)]:
            icon = ImageOps.contain(image.convert("RGBA"), (size, size), Image.Resampling.LANCZOS)
            canvas = Image.new("RGBA", (size, size))
            canvas.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
            digest = hashlib.sha256(source.read_bytes() + str(size).encode() + SETTINGS).hexdigest()[:12]
            path = OUTPUT / "brand" / f"{Path(name).stem}.{digest}.png"
            path.parent.mkdir(parents=True, exist_ok=True)
            canvas.save(path, optimize=True)
            records[name] = str(path.relative_to(ROOT))
        header = ImageOps.contain(image.convert("RGBA"), (144, 162), Image.Resampling.LANCZOS)
        digest = hashlib.sha256(source.read_bytes() + b"header-144x162" + SETTINGS).hexdigest()[:12]
        path = OUTPUT / "brand" / f"header-logo.{digest}.webp"
        save_webp(header, path)
        records["header-logo.webp"] = str(path.relative_to(ROOT))
    return records


def main():
    media = {}
    ffmpeg = None
    for relative in referenced_media():
        source = ROOT / relative
        if not source.is_file():
            raise FileNotFoundError(relative)
        if source.suffix.lower() == ".mp4":
            ffmpeg = ffmpeg or find_ffmpeg()
            record = optimize_video(source, ffmpeg)
            print(f"Video {source.name}: {record['originalBytes'] / 1e6:.2f} -> {record['bytes'] / 1e6:.2f} MB", flush=True)
        else:
            record = optimize_image(source)
        media[relative] = record
    manifest = {"version": 1, "media": media, "icons": create_icons()}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    original = sum(record["originalBytes"] for record in media.values())
    optimized = sum(record["bytes"] for record in media.values())
    print(f"Media: {len(media)} files; {original / 1e6:.2f} -> {optimized / 1e6:.2f} MB; originals preserved.")


if __name__ == "__main__":
    main()
