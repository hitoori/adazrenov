const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..', 'dist');
const port = Number(process.env.ADAZ_PREVIEW_PORT || 8765);
const compressed = new Map();
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build before preview.');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port.');

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); return response.end(); }
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) {
    response.writeHead(403); return response.end();
  }
  if (file === root) file = path.join(root, 'index.html');
  else if (!path.extname(file)) file += '.html';

  let status = 200;
  let stat;
  try { stat = fs.statSync(file); if (!stat.isFile()) throw new Error('Not a file'); }
  catch { file = path.join(root, '404.html'); stat = fs.statSync(file); status = 404; }
  const headers = {
    'Content-Type': types[path.extname(file)] || 'application/octet-stream',
    'Content-Length': stat.size, 'Cache-Control': 'no-cache',
    'Accept-Ranges': 'bytes', 'X-Content-Type-Options': 'nosniff',
  };
  if (/\.(?:html|css|js|json|xml|txt)$/.test(file) && stat.size > 1000 && !request.headers.range) {
    headers.Vary = 'Accept-Encoding';
    const acceptsGzip = (request.headers['accept-encoding'] || '').split(',').some(value => {
      const [encoding, quality] = value.trim().split(';');
      return encoding === 'gzip' && (!quality || Number(quality.split('=')[1]) > 0);
    });
    if (acceptsGzip) {
      const cached = compressed.get(file);
      const data = cached?.mtime === stat.mtimeMs ? cached.data : zlib.gzipSync(fs.readFileSync(file));
      compressed.set(file, { mtime: stat.mtimeMs, data });
      headers['Content-Encoding'] = 'gzip';
      headers['Content-Length'] = data.length;
      delete headers['Accept-Ranges'];
      response.writeHead(status, headers);
      return response.end(request.method === 'HEAD' ? undefined : data);
    }
  }
  let start = 0;
  let end = stat.size - 1;
  if (request.headers.range && status === 200) {
    const match = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
    if (!match || (!match[1] && !match[2])) {
      response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return response.end();
    }
    if (match[1]) {
      start = Number(match[1]);
      if (match[2]) end = Math.min(Number(match[2]), end);
    } else start = Math.max(0, stat.size - Number(match[2]));
    if (start > end || start >= stat.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return response.end();
    }
    status = 206;
    headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    headers['Content-Length'] = end - start + 1;
  }
  response.writeHead(status, headers);
  if (request.method === 'HEAD') return response.end();
  const stream = fs.createReadStream(file, { start, end });
  stream.on('error', () => response.destroy());
  response.on('close', () => stream.destroy());
  stream.pipe(response);
});

server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}/`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
