#!/usr/bin/env node
// Installs the test-guide agent, commands and skills into opencode.
// Usage: npx github:<owner>/test-guide [--global] [--project <dir>] [--no-skills] [--uninstall]
import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const projIdx = args.indexOf("--project");

const dest = has("--global")
  ? join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "opencode")
  : join(resolve(projIdx >= 0 ? args[projIdx + 1] : process.cwd()), ".opencode");

const parts = [["agents", "agents"], ["commands", "commands"]];
if (!has("--no-skills")) parts.push(["skills", "skills"]);

for (const [from, to] of parts) {
  const target = join(dest, to);
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(join(src, from))) {
    const out = join(target, name);
    if (has("--uninstall")) { if (existsSync(out)) rmSync(out, { recursive: true }); continue; }
    cpSync(join(src, from, name), out, { recursive: true });
    console.log(`  ✓ ${to}/${name}`);
  }
}
console.log(has("--uninstall") ? `Removed test-guide from ${dest}` :
  `\nInstalled into ${dest}\nStart opencode → Tab → test-guide → /test-start <session> <target>\nTip: add .manual-tests/ to .gitignore`);
