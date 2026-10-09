import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Production uses the secret already saved in Cloudflare. Never upload a local
// development key or a key inherited from the terminal during deployment.
const directory = await mkdtemp(join(tmpdir(), "adazai-deploy-"));
const emptyEnvFile = join(directory, "empty.env");
await writeFile(emptyEnvFile, "", { mode: 0o600 });
const deploymentEnv = { ...process.env };
delete deploymentEnv.OPENAI_API_KEY;
delete deploymentEnv.RESEND_API_KEY;
deploymentEnv.CLOUDFLARE_INCLUDE_PROCESS_ENV = "false";
const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));

try {
  process.exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [wrangler, "deploy", "--env-file", emptyEnvFile, ...process.argv.slice(2)], {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      env: deploymentEnv,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}
