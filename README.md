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
# Agent + commands + skills into the current project (opencode)
npx github:<owner>/test-guide

# Global install
npx github:<owner>/test-guide --global

# Skills only (works in any agent supported by skills.sh)
npx skills add <owner>/test-guide
```

Uninstall with `npx github:<owner>/test-guide --uninstall` (add `--global` if installed globally).

## Usage

1. Start `opencode`, press **Tab** and select **test-guide**.
2. Choose a model with `/models` (no model is pinned).
3. Run `/test-start user-me docs/specs/user-me.md PROJ-123`.

| Command                          | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| `/test-start <session> <target>` | New session (target: feature, spec paths, Jira key)   |
| `/test-resume <session>`         | Continue and re-run only impacted scenarios           |
| `/test-status`                   | Status Board                                          |
| `/test-report`                   | Final report                                          |
| `/test-bug S<n>`                 | Bug draft for a failed scenario (optional)            |
| `/test-automate [S…]`            | Turn passed scenarios into automated tests (optional) |

## Workflow

0. **Harness and preflight**: environment and baseline → one visible harness file that you approve → a read-only preflight.
1. **Context**: system under test, rules `[Rn]` from ticket, spec and code, gaps → you confirm.
2. **Scenarios**: a short list of critical scenarios → you adjust and say "create" → one file per scenario.
3. **Execution**: one Step Card per step (`n / N`, with _What it means_) → you run it → Result Card (expected vs. actual).
4. **Close**: report, cleanup commands, plus optional bug draft or automation.

Session state lives in `.manual-tests/<session>/` (context, `scenarios/S<nn>-<slug>.md`, log, `state.env`, harness, evidence, report), so you can resume across days. Add it to `.gitignore` or commit it as test evidence.

## What's inside

| Part                              | Type   | Loaded                                                                                  |
| --------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `test-guide`                      | Agent  | You select it (Tab). It can't run commands; it only writes `.manual-tests/**` freely.   |
| `test-guide`                      | Skill  | Every session: phases, rules, card formats, templates for scenario files and Step Cards |
| `test-guide-harness`              | Skill  | Phase 0: harness file, `state.env`, helpers, cleanup                                    |
| `test-guide-api` · `-cli` · `-ui` | Skills | Only for a step on that surface                                                         |
| `test-guide-jira`                 | Skill  | Only when a Jira key is given                                                           |
| `test-guide-bug` · `-automate`    | Skills | Only on request                                                                         |

The agent enforces "you run every command" through permissions. With skills only, it's an instruction the model is asked to follow.

## Optional: Jira and Playwright

See `examples/opencode.jsonc`. Enable the Jira MCP server only in projects that use it.

## Contributing

- `npm run format` formats the files with Prettier. `npm run format:check` and `npm test` run in CI on each PR.
- `npm test` checks that each skill has a valid `name` (equal to its folder) and `description`, that all linked skills and files exist, and that the installer installs and uninstalls.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/): `feat: …`, `fix: …`, `docs: …`. On `master`, release-please uses them to open a release PR that updates the version and `CHANGELOG.md`. Merging that PR creates the tag and the GitHub release. Do not change the version by hand.

## License

MIT
