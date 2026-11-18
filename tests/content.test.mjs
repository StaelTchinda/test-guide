// Checks that skills, commands and agents are valid and that their links point to real files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (...p) => readFileSync(join(root, ...p), "utf8");
const list = (dir, ext) => readdirSync(join(root, dir)).filter((f) => !ext || f.endsWith(ext));
const skills = list("skills");

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

// Skill names mentioned in a text, for example `test-guide-api`.
const skillRefs = (text) => [...new Set(text.match(/\btest-guide-[a-z]+\b/g) ?? [])];

for (const skill of skills) {
  test(`skill ${skill}: valid frontmatter`, () => {
    const fm = frontmatter(read("skills", skill, "SKILL.md"));
    assert.ok(fm, "SKILL.md must start with a --- frontmatter block");
    assert.equal(fm.name, skill, "name must equal the folder name");
    assert.match(fm.name, /^[a-z0-9]+(-[a-z0-9]+)*$/, "name: lowercase, digits and single hyphens only");
    assert.ok(fm.description, "description is required");
    assert.ok(fm.description.length <= 1024, "description must be max 1024 characters");
  });

  test(`skill ${skill}: links point to real files and skills`, () => {
    const text = read("skills", skill, "SKILL.md");
    for (const file of text.match(/\b(?:templates|references|scripts)\/[\w./-]+\.\w+/g) ?? []) {
      assert.ok(existsSync(join(root, "skills", skill, file)), `missing file ${file}`);
    }
    for (const ref of skillRefs(text)) {
      assert.ok(skills.includes(ref), `unknown skill ${ref}`);
    }
  });
}

for (const cmd of list("commands", ".md")) {
  test(`command ${cmd}: valid and linked`, () => {
    const text = read("commands", cmd);
    const fm = frontmatter(text);
    assert.ok(fm?.description, "description is required");
    if (fm.agent) assert.ok(existsSync(join(root, "agents", `${fm.agent}.md`)), `unknown agent ${fm.agent}`);
    for (const ref of skillRefs(text)) assert.ok(skills.includes(ref), `unknown skill ${ref}`);
  });
}

for (const agent of list("agents", ".md")) {
  test(`agent ${agent}: valid and linked`, () => {
    const text = read("agents", agent);
    assert.ok(frontmatter(text)?.description, "description is required");
    for (const ref of skillRefs(text)) assert.ok(skills.includes(ref), `unknown skill ${ref}`);
  });
}
