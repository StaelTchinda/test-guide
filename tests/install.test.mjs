// Smoke test of the installer: install into a temp project, check the files, then uninstall.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const installer = join(root, "bin", "install.mjs");
const run = (...args) => execFileSync(process.execPath, [installer, ...args], { encoding: "utf8" });
const names = (dir) => readdirSync(join(root, dir));

function withTempProject(fn) {
  const dir = mkdtempSync(join(tmpdir(), "test-guide-"));
  try {
    fn(dir, join(dir, ".opencode"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("install copies agents, commands and skills; uninstall removes them", () => {
  withTempProject((project, dest) => {
    run("--project", project);
    for (const part of ["agents", "commands", "skills"]) {
      for (const name of names(part)) assert.ok(existsSync(join(dest, part, name)), `missing ${part}/${name}`);
    }
    run("--project", project, "--uninstall");
    for (const part of ["agents", "commands", "skills"]) {
      for (const name of names(part)) assert.ok(!existsSync(join(dest, part, name)), `not removed ${part}/${name}`);
    }
  });
});

test("--no-skills skips the skills", () => {
  withTempProject((project, dest) => {
    run("--project", project, "--no-skills");
    assert.ok(existsSync(join(dest, "agents")));
    assert.ok(!existsSync(join(dest, "skills")));
  });
});
