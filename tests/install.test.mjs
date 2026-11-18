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
const skills = readdirSync(join(root, "skills"));

test("install copies the skills with their files; uninstall removes them", () => {
  const project = mkdtempSync(join(tmpdir(), "test-guide-"));
  const dest = join(project, ".opencode", "skills");
  try {
    run("--project", project);
    for (const name of skills) assert.ok(existsSync(join(dest, name, "SKILL.md")), `missing skills/${name}`);
    assert.ok(existsSync(join(dest, "test-guide", "templates", "step-card.md")), "missing templates");
    assert.ok(existsSync(join(dest, "test-guide", "references", "jira.md")), "missing references");

    run("--project", project, "--uninstall");
    for (const name of skills) assert.ok(!existsSync(join(dest, name)), `not removed skills/${name}`);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});
