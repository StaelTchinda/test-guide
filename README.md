# test-guide

A manual-testing companion for [opencode](https://opencode.ai). It builds context from your specs, code and Jira, designs evidence-based test scenarios with you, and then walks you through them step by step. **You run every command**; it explains what to do, what to expect, and compares the result.

```
## ▶ S3 · Expired token                 [2/7 · ✅2 ❌0 ❓0]
**Surface:** API    **Covers:** R2 (spec §3)
### Do
!curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN_EXPIRED" localhost:8080/api/users/me
### Expect
- HTTP 401
### Why this proves it
Catches an auth guard that checks the signature but not the expiry.
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

| Command | Purpose |
|---|---|
| `/test-start <session> <target>` | New session (target: feature, spec paths, Jira key) |
| `/test-resume <session>` | Continue and re-run only impacted scenarios |
| `/test-status` | Status Board |
| `/test-report` | Final report |
| `/test-bug S<n>` | Bug draft for a failed scenario (optional) |
| `/test-automate [S…]` | Turn passed scenarios into automated tests (optional) |

## Workflow

1. **Context**: system under test, rules `[Rn]` with sources, gaps → you confirm.
2. **Scenarios**: table with expected results and *why each one proves correctness* → you adjust.
3. **Execution**: one Step Card at a time → you run it → Result Card (expected vs. actual).
4. **Close**: report, plus optional bug draft or automation.

Session state lives in `.manual-tests/<session>/` (context, scenarios, log, report, evidence), so you can resume across days. Add it to `.gitignore` or commit it as test evidence.

## What's inside

| Part | Type | Loaded |
|---|---|---|
| `test-guide` | Agent | You select it (Tab). It can't run commands; it only writes `.manual-tests/**` freely. |
| `test-guide` | Skill | Every session: phases, rules, card formats |
| `test-guide-api` · `-cli` · `-ui` | Skills | Only for a step on that surface |
| `test-guide-jira` | Skill | Only when a Jira key is given |
| `test-guide-bug` · `-automate` | Skills | Only on request |

The agent enforces "you run every command" through permissions. With skills only, it's an instruction the model is asked to follow.

## Optional: Jira and Playwright

See `examples/opencode.jsonc`. Enable the Jira MCP server only in projects that use it.

## License

MIT
