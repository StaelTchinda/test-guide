#!/usr/bin/env node
// Installs the test-guide skill into opencode.
// Usage: npx github:StaelTchinda/test-guide [--global] [--project <dir>] [--uninstall]
import { cpSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const src = join(resolve(dirname(fileURLToPath(import.meta.url)), ".."), "skills");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const projIdx = args.indexOf("--project");

const dest = has("--global")
  ? join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "opencode")
  : join(resolve(projIdx >= 0 ? args[projIdx + 1] : process.cwd()), ".opencode");
const target = join(dest, "skills");

mkdirSync(target, { recursive: true });
for (const name of readdirSync(src)) {
  const out = join(target, name);
  if (has("--uninstall")) {
    if (existsSync(out)) rmSync(out, { recursive: true });
    continue;
  }
  cpSync(join(src, name), out, { recursive: true });
  console.log(`  ✓ skills/${name}`);
}
console.log(
  has("--uninstall")
    ? `Removed test-guide from ${dest}`
    : `\nInstalled into ${dest}\nStart opencode and ask: "Guide me through a manual test of <feature>"\nTip: add .manual-tests/ to .gitignore`,
);
