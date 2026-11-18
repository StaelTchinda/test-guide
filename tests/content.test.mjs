// Checks that the skills are valid and that their links point to real files and sections.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(root, ...p), "utf8");
const skills = readdirSync(join(root, "skills"));

// Returns the YAML frontmatter as a { key: value } object (flat keys only).
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

// GitHub-style anchor of a heading: lowercase, spaces → "-", most punctuation removed.
const anchor = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");

for (const skill of skills) {
  test(`skill ${skill}: valid frontmatter`, () => {
    const fm = frontmatter(read("skills", skill, "SKILL.md"));
    assert.ok(fm, "SKILL.md must start with a --- frontmatter block");
    assert.equal(fm.name, skill, "name must equal the folder name");
    assert.match(fm.name, /^[a-z0-9]+(-[a-z0-9]+)*$/, "name: lowercase, digits and single hyphens only");
    assert.ok(fm.description, "description is required");
    assert.ok(fm.description.length <= 1024, "description must be max 1024 characters");
  });

  test(`skill ${skill}: linked files and sections exist`, () => {
    const text = read("skills", skill, "SKILL.md");
    for (const file of text.match(/\b(?:templates|references|scripts)\/[\w./-]+\.\w+/g) ?? []) {
      assert.ok(existsSync(join(root, "skills", skill, file)), `missing file ${file}`);
    }
    const anchors = (text.match(/^#+ .+$/gm) ?? []).map((h) => anchor(h.replace(/^#+ /, "")));
    for (const [, link] of text.matchAll(/\]\(#([^)]+)\)/g)) {
      assert.ok(anchors.includes(link), `missing section #${link}`);
    }
  });
}

// The version in the release-please manifest is the source of truth. Other files must match it.
test("version: package.json and extra-files match the release-please manifest", () => {
  const version = JSON.parse(read(".release-please-manifest.json"))["."];
  assert.equal(JSON.parse(read("package.json")).version, version, "package.json version (do not change it by hand)");

  const config = JSON.parse(read("release-please-config.json")).packages["."];
  for (const entry of config["extra-files"] ?? []) {
    const file = typeof entry === "string" ? entry : entry.path;
    const text = read(file);
    if (typeof entry === "object" && entry.jsonpath) {
      const value = entry.jsonpath
        .replace(/^\$\.?/, "")
        .split(".")
        .reduce((o, k) => o?.[k], JSON.parse(text));
      assert.equal(value, version, `${file} ${entry.jsonpath}`);
    } else {
      const lines = text.split(/\r?\n/).filter((l) => l.includes("x-release-please-version"));
      assert.ok(lines.length > 0, `${file}: no line with x-release-please-version`);
      for (const line of lines) assert.ok(line.includes(version), `${file}: "${line.trim()}" must contain ${version}`);
    }
  }
});
