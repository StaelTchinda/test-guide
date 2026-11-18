# test-guide

An [agent skill](https://agentskills.io) for guided manual testing, made for [opencode](https://opencode.ai) and other coding agents. It builds context from your specs, code and Jira, designs evidence-based test scenarios with you, and then walks you through them step by step. **You run every command**; it explains what to do, what to expect, and compares the result.

## A session in 1 minute

The full files of this session are in [`examples/session/`](examples/session/).

> **You:** Manually test the new `DELETE /todos/:id` with me. Spec in `docs/api.md`.

**Agent** (Phase 1 · context):

```
[R1] Owner deletes → 204, row removed — docs/api.md §Delete
[R2] Other user deletes → 403, row stays — docs/api.md §Delete, src/routes/todos.ts:42
[R3] No token → 401 — src/middleware/auth.ts:10
❓ Gap: a second DELETE of the same todo → 404 or 204? The spec is silent.
Correct / missing?
```

**Agent** (Phase 2 · scenarios): a list of 4 scenarios. You answer "create". It writes one file per scenario.

**Agent** (Phase 3 · a Step Card):

````
## ▶ S02 · Other user cannot delete the todo      [1/4 · ✅1 ❌0 ❓0]
**Surface:** API    **Covers:** R2
**About this scenario:** Alice creates a todo. Bob tries to delete it.
**A PASS means:** Nobody can delete the todos of another user.

### Step 2 / 3 · Bob deletes Alice's todo
```bash
!. ./.manual-tests/todo-delete/harness.sh; curl -s -o /dev/null -w "%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN_BOB" $BASE/todos/$TODO_ID
```
**What this does:** loads the harness (and the saved tokens), sends the DELETE as Bob, prints only the HTTP status.
**Expect:** 403
**What it means:** the server refused Bob.
````

> **You:** `204`

**Agent** (Result Card, after step 3):

```
## S02 · FAIL ❌
| Check            | Expected | Actual |    |
| Status           | 403      | 204    | ❌ |
| Row still exists | 1        | 0      | ❌ |
**What it means:** Bob deleted Alice's todo. The route checks the login, not the owner (src/routes/todos.ts:42).
```

**Agent** (Phase 4): writes [`report.md`](examples/session/report.md) and gives the cleanup command.

## Install

```bash
# Into the current project (opencode: .opencode/skills/)
npx github:StaelTchinda/test-guide

# Global install (~/.config/opencode/skills/)
npx github:StaelTchinda/test-guide --global

# A fixed version
npx github:StaelTchinda/test-guide#v0.2.0 # x-release-please-version

# Any agent supported by skills.sh
npx skills add StaelTchinda/test-guide
```

Uninstall with `npx github:StaelTchinda/test-guide --uninstall` (add `--global` if installed globally).

## Usage

Start your agent (for example `opencode` or Claude Code) and ask, for example:

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

An example of a complete session is in [`examples/session/`](examples/session/).

"You run every command" is an instruction in the skill. To enforce it, deny the `bash` tool in your agent's permissions.

## Optional: Jira

Connect a Jira MCP server to your agent. When you give a ticket key, the skill reads the ticket and its acceptance criteria. Without Jira tools, it asks you to paste them.

## Contributing

- `npm run format` formats the files with Prettier. `npm run format:check` and `npm test` run in CI on each PR.
- `npm test` checks that each skill has a valid `name` (equal to its folder) and `description`, that all linked files and sections exist, that the version matches the release-please manifest, and that the installer installs and uninstalls.
- Write commit messages as [Conventional Commits](https://www.conventionalcommits.org/): `feat: …`, `fix: …`, `docs: …`. On `master`, release-please uses them to open a release PR that updates the version and `CHANGELOG.md`. Merging that PR creates the tag and the GitHub release. Do not change the version by hand.

## License

MIT
