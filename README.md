# test-guide

A manual-testing companion for [opencode](https://opencode.ai). It builds context from your specs, code and Jira, designs evidence-based test scenarios with you, and then walks you through them step by step. **You run every command**; it explains what to do, what to expect, and compares the result.

```
## ▶ S03 · Expired token                 [2/7 · ✅2 ❌0 ❓0]
**Surface:** API    **Covers:** R2 (spec §3)
**About this scenario:** Call the profile route with an expired token.
**A PASS means:** A user with an old login cannot read data.

### Step 1 / 1 · Call with the expired token
!. ./.manual-tests/user-me/harness.sh; curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $TOKEN_EXPIRED" localhost:8080/api/users/me
**What this does:** loads the harness (and state.env), then prints only the HTTP status.
**Expect:** 401
**What it means:** the server refused the old token.
```

## Install

```bash
# Into the current project (opencode: .opencode/skills/)
npx github:StaelTchinda/test-guide

# Global install (~/.config/opencode/skills/)
npx github:StaelTchinda/test-guide --global

# A fixed version
npx github:StaelTchinda/test-guide#v0.3.0 # x-release-please-version

# Any agent supported by skills.sh
npx skills add StaelTchinda/test-guide
```

Uninstall with `npx github:StaelTchinda/test-guide --uninstall` (add `--global` if installed globally).

## Usage

Start `opencode` (any agent) and ask, for example:

- "Guide me through a manual test of the `/users/me` endpoint, spec in `docs/specs/user-me.md`."
- "Manually test PROJ-123 with me."
- "Resume the test session `user-me`."

The agent loads the `test-guide` skill and follows its phases.

## Workflow

0. **Harness and preflight**: environment and baseline → one visible harness file that you approve → a read-only preflight.
1. **Context**: system under test, rules `[Rn]` from ticket, spec and code, gaps → you confirm.
2. **Scenarios**: a short list of critical scenarios → you adjust and say "create" → one file per scenario.
3. **Execution**: one Step Card per step (`n / N`, with _What it means_) → you run it → Result Card (expected vs. actual).
4. **Close**: report and cleanup commands. On request, a bug draft for a failed scenario.

Session state lives in `.manual-tests/<session>/` (context, `scenarios/S<nn>-<slug>.md`, log, `state.env`, harness, evidence, report), so you can resume across days. Add it to `.gitignore` or commit it as test evidence.

## What's inside

One skill, `skills/test-guide/`:

| File                     | Content                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| `SKILL.md`               | Golden rules, phases, harness, rules for API / CLI / UI steps, card formats |
| `templates/scenario.md`  | One file per scenario                                                       |
| `templates/step-card.md` | The Step Card format                                                        |
| `references/jira.md`     | Read only when a Jira key is given                                          |

"You run every command" is an instruction in the skill. To enforce it, deny the `bash` tool in your agent's permissions.

## Optional: Jira and Playwright

See `examples/opencode.jsonc`. Enable the Jira MCP server only in projects that use it.

## Contributing

- `npm run format` formats the files with Prettier. `npm run format:check` and `npm test` run in CI on each PR.
- `npm test` checks that each skill has a valid `name` (equal to its folder) and `description`, that all linked files and sections exist, that the version matches the release-please manifest, and that the installer installs and uninstalls.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/): `feat: …`, `fix: …`, `docs: …`. On `master`, release-please uses them to open a release PR that updates the version and `CHANGELOG.md`. Merging that PR creates the tag and the GitHub release. Do not change the version by hand.

## License

MIT
