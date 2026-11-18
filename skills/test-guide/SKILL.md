---
name: test-guide
description: Guided manual testing (QA) with the user in the loop. Use when the user wants to manually test or verify a feature, endpoint, CLI, UI, ticket or bug fix, turn acceptance criteria into a test plan, run smoke or acceptance tests by hand, or resume a manual test session. Builds context from specs, code and Jira, designs evidence-based scenarios, then guides the user step by step while the USER runs every command.
license: MIT
metadata:
  author: StaelTchinda
  version: "0.2.0" # x-release-please-version
---

# Guided manual testing

## Golden rules

1. The USER runs every command. You never run one. Not even `--help` or a syntax check. Give each command in a code block, ready to copy. If the tool runs shell commands typed with a `!` prefix (for example opencode, Claude Code), add the `!`.
2. Glass box: every command is visible in the Step Card. The user must be able to explain each step. No logic hides in a script the user has not seen.
3. One window. Never ask for a second terminal, a second tool or a manual restart.
4. One step = one command (parts may be chained when they are one action). Each command runs in a fresh shell: every step starts with the harness line. State lives in `state.env`, never in shell variables between steps.
5. Wait for explicit approval before you create files, use a helper for the first time, or write to a database.
6. Adapt to the system: shell, tools and language follow the system under test. The ideas stay the same.
7. Self-contained cards: the user reads only the current message, then copies and pastes. Never make the user remember a value or scroll back.
8. Do only what the user approved. No PR, ticket, comment or file outside the plan.
9. Shared resources (deployed environment, Confluence, GitHub, Jira): warn before a step writes to them. Do not create items that other people do not expect.
10. When the user does not understand: explain again in simple words, with an analogy and the effect of each option. When the user asks a side question during a run, answer it briefly and continue the run.

## Phase 0 · Harness and preflight

1. Ask in ONE message: which environment (local or deployed; use the one the user names, never change it) and which baseline (default: the latest git state of the target branch; merge or rebase if necessary).
2. Write `harness.<ext>` (see [Harness](#harness)). Show it and explain it part by part. Wait for "approved". Show every later change as a diff.
3. Give one read-only preflight block. Check: commit of the code under test (write it in context.md), config/.env, database reachable and LOCAL, migration head = code head, port free, keys/tokens present.
4. Tell the user which database the tests write to, before the first write.
5. Data that you need (URL, id, token location): find it first in files, configs, logs and earlier session files. If you cannot find it, give the user the command or a step-by-step guide to get it.

## Phase 1 · Context

Collect only what's needed to test the feature:

- System under test: start command, URL/binary, auth, test data.
- Rules from the ticket (and its parent ticket), the spec AND the code: `[Rn] rule — source (file§ / file:line / KEY AC#)`. The code alone is not enough. If the change touches the UI, include UI rules.
- Gaps: where the spec is silent or the code ≠ the spec.

If a Jira key is given, read `references/jira.md`. Keep the brief to ≤ 40 lines.
`context.md` starts with: the session folder, `$REPO` (system under test), the commit.
Show the brief and ask: "Correct / missing?"

## Phase 2 · Scenarios

1. Show the LIST: key, title, surface, covers. Cover every [Rn] (Coverage line).
   Order: happy → auth → validation/edge → negative → regression. Destructive scenarios (migration down, delete) last.
2. Put ambiguities under ❓ Open questions. Never guess.
3. The user may add, remove or reorder. Wait for the word "create". Only then write one file per scenario from `templates/scenario.md`. The number of commands that the Step Cards will show must equal the number of rows in the Steps table.
4. A scenario that needs a second window is a design defect. Redesign it.
5. Each scenario starts from a known state (for example: empty the queue, create a fresh test user). Before a reset, ask what to reset. Delete the data, not the database.
6. Keep only the critical scenarios. Remove scenarios that are not relevant or that duplicate another. Split a scenario that mixes surfaces (for example CLI and UI).
7. After you create the files, give their absolute paths, so the user can review them.

## Phase 3 · Execution

One scenario at a time:

1. Apply the [Surface rules](#surface-rules) of the scenario.
2. Before you write a command, check each table, column, header and field name in the source. Make sure that the preconditions of the step are true (for example: the service responds). If not, give the fix first.
3. Show one Step Card per step, in the format of `templates/step-card.md`. Wait for the user's output.
4. Show the Result Card. Update `Status` and `Result` in the scenario file. Append one line to `log.md`.

- Before FAIL, triage: setup/test data, spec, MY OWN command, or system (for example: an empty answer from the UI can be a backend that is down). A wrong command of mine is not a FAIL: fix it, and write it in `Result`. Give ONE check command.
- If the spec is silent → OPEN ❓, record the question, tell the user before PASS.
- Shorten long values (tokens) in the cards and say so.
- Bug fix: reproduce on the old code first (must FAIL), then verify on the fix (must PASS).

## Phase 4 · Close

- Write report.md from the scenario files. Give the cleanup commands (files, rows and processes that the tests created).
- On request, draft a bug for a FAIL from its scenario file: steps to reproduce (the real commands), expected, actual, evidence, spec ref, severity (proposal).
- A report that goes online (Jira, PR): one summary comment in the format of that tool (Jira: wiki markup), with the test procedure. No relative paths.

## Resume

Read the session files only. Show the Status Board. Ask the user to run the preflight and
`git log --oneline <last-commit>..HEAD --stat`. A merge can change the commit, the migration number or the ports.
Map the changed files to scenarios and propose a re-run plan.

## State (trust the files, not chat memory)

`.manual-tests/<session>/` → context.md · scenarios/S<nn>-<slug>.md · log.md · state.env · harness.<ext> · evidence/ · report.md

## Harness

ONE visible file with a few short functions, in the session folder. `$REPO` points to the system under test (it may be a worktree). Every step starts with the harness line (dot-source the file).

Content (one short comment per part):

1. Fixed values: `$REPO`, session folder, `state.env`, log file, base URL.
2. Load `state.env`: each `KEY=VALUE` line becomes a variable.
3. `save KEY VALUE`: write to `state.env` (replace the old value) and set the variable.
4. `*_up` / `*_down` / `*_logs`: start, stop and read the log of the system under test.
5. `sql "query"` (or the query tool of the system).
6. One function per action that repeats and is long (example: `upload PATH FILE`).

Rules:

- Use the real tool of the system (`curl`, `psql`, the CLI). No wrapper that hides the call.
- Background process: start it in its own minimized window and redirect its output inside that window (for example `cmd /c "... > log 2>&1"`). Do NOT use the redirect options of `Start-Process`: the user's command then never returns. Stop by the listening port, not only by a saved pid.
- State is plain text. Secrets, keys and tokens: local test data only. Tell the user where they are stored.
- Keep a list of what the tests create, for the cleanup.

Helper files (exception): allowed only when the system has no real interface for the action (example: no route creates a test account with its API key).

- Use the project's own function. One purpose. At most about 40 lines.
- Show it in full, explain it line by line, and wait for "clear" before first use.
- It prints `KEY=VALUE` lines. The step saves them with `save`. List every helper in `context.md`.
- A tip for one machine or one project (a shell alias, a local token file) goes into the project notes (for example `AGENTS.md`), not into this skill.

## Surface rules

### API

- Use `curl` (Windows PowerShell 5.1: `curl.exe`; `curl` is an alias). Explain each flag in "What this does".
- Always show the status. `-s -i` shows status line, headers and body. `-o NUL -w "%{http_code}"` (Unix: `-o /dev/null`) shows only the status.
- Windows PowerShell 5.1: pass JSON as `-d '{\"a\":1}'`. `$r = curl.exe -s -i …` gives lines: `$r[0]` is the status line, `$r[-1]` is the body.
- Tokens and ids go to `state.env` with `save`.
- Side effects: read the database BEFORE and AFTER the call.
- A rule with a time window (throttle, expiry): put all calls of the window into one command.
- Check: status, required fields, no extra/sensitive fields, error body format, idempotency (the same call twice). Keep output small.

### CLI

- Always capture the exit code: `<cmd>; echo "exit=$?"` (PowerShell: `"exit=$LASTEXITCODE"`).
- Split stdout and stderr when it matters. Use an isolated temp dir for commands that write files.
- Check: --help, missing/invalid args, env overrides, non-TTY (`| cat`), re-run idempotency.

### UI

- The user clicks. Write numbered click paths with the visible labels ("Click **Save**").
- Expectations must be observable: text, element state, URL, and the network call (DevTools → Network: method, path, status). Evidence: the user reports it or saves a screenshot to `evidence/`.
- A second browser window only when the user must use a GUI (login, SSO). Ask first and write it in the scenario.
- Check: loading/empty/error states, keyboard navigation, refresh/back, session expiry.

## Formats (use exactly; no prose outside the cards except a one-line clarification)

### Scenario list

```
## Scenarios · <feature>
| Key | Title | Surface | Covers |
Coverage: R1→S01,S03 · R2→S02
❓ Open questions: …
```

### Step Card

Use `templates/step-card.md` exactly. Step 1 shows the scenario header (`About this scenario`, `A PASS means`). Every step title shows `n / N` (N = rows in the Steps table). Every `Expect` is followed by `What it means` (what the step has just done, in plain words).

### Result Card

```
## S<nn> · PASS ✅ | FAIL ❌ | OPEN ❓
| Check | Expected | Actual | |
**What it means:** <on PASS: "A PASS means" of the scenario, in plain words. On FAIL/OPEN: what is wrong or unknown, for the user.>
What happened: <one line, only when the result is surprising>
### Next
<one line>
```

### Status Board (after every 3 scenarios and on request; built from the Status field of each file)

```
## 📋 <session> · <done>/<total>
| # | Scenario | Surface | Result |
```

### log.md line

`S<nn> · <PASS|FAIL|OPEN> · <yyyy-mm-dd hh:mm> · commit <sha>` (details stay in `Result`)

### report.md

Header (feature, commit, date) · Summary `✅ · ❌ · ❓ · ⏭` · results table with evidence · Failures · Open questions · Setup/test-data issues.
