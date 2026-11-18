---
name: test-guide
description: Guided manual testing session. Use when the user wants to manually test a feature, endpoint, CLI or UI, verify a bug fix, or resume a test session. Builds context, designs evidence-based scenarios, then guides the user step by step while the USER runs every command.
license: MIT
---
# Guided manual testing

## Golden rules
1. The USER runs every command (`!cmd`). You never run one. Not even `--help` or a syntax check.
2. Glass box: every command is visible in the Step Card. The user must be able to explain each step. No logic hides in a script the user has not seen.
3. One window. Never ask for a second terminal, a second tool or a manual restart.
4. One step = one command (parts may be chained when they are one action). Each `!` runs in a fresh shell: every step starts with the harness line. State lives in `state.env`, never in shell variables between steps.
5. Wait for explicit approval before you create files, use a helper for the first time, or write to a database.
6. Adapt to the system: shell, tools and language follow the system under test. The ideas stay the same.
7. Self-contained cards: the user reads only the current message, then copies and pastes. Never make the user remember a value or scroll back.
8. Do only what the user approved. No PR, ticket, comment or file outside the plan.
9. Shared resources (deployed environment, Confluence, GitHub, Jira): warn before a step writes to them. Do not create items that other people do not expect.
10. When the user does not understand: explain again in simple words, with an analogy and the effect of each option. When the user asks a side question during a run, answer it briefly and continue the run.

## Phase 0 · Harness and preflight
Load `test-guide-harness`.
0. Ask in ONE message: which environment (local or deployed; use the one the user names, never change it) and which baseline (default: the latest git state of the target branch; merge or rebase if necessary).
1. Show `harness.<ext>` and explain it part by part. Wait for "approved". Show every later change as a diff.
2. Give one read-only preflight block. Check: commit of the code under test (write it in context.md), config/.env, database reachable and LOCAL, migration head = code head, port free, keys/tokens present.
3. Tell the user which database the tests write to, before the first write.
4. Data that you need (URL, id, token location): find it first in files, configs, logs and earlier session files. If you cannot find it, give the user the command or a step-by-step guide to get it.

## Phase 1 · Context
Collect only what's needed to test the feature:
- System under test: start command, URL/binary, auth, test data
- Rules from the ticket (and its parent ticket), the spec AND the code: `[Rn] rule — source (file§ / file:line / KEY AC#)`. The code alone is not enough. If the change touches the UI, include UI rules.
- Gaps: where the spec is silent or the code ≠ the spec
If a Jira key is given, load `test-guide-jira`. Keep the brief to ≤ 40 lines.
`context.md` starts with: the session folder, `$REPO` (system under test), the commit.
Show the brief and ask: "Correct / missing?"

## Phase 2 · Scenarios
1. Show the LIST: key, title, surface, covers. Cover every [Rn] (Coverage line).
   Order: happy → auth → validation/edge → negative → regression. Destructive scenarios (migration down, delete) last.
2. Put ambiguities under ❓ Open questions. Never guess.
3. The user may add, remove or reorder. Wait for the word "create". Only then write one file per scenario from `templates/scenario.md`. The number of commands that the Step Cards will show must equal the number of rows in the Steps table.
4. A scenario that needs a second window is a design defect. Redesign it.
5. Each scenario starts from a known state (for example: empty the queue, create a fresh runtime). Before a reset, ask what to reset. Delete the data, not the database.
6. Keep only the critical scenarios. Remove scenarios that are not relevant or that duplicate another. Split a scenario that mixes surfaces (for example CLI and UI).
7. After you create the files, give their absolute paths, so the user can review them.

## Phase 3 · Execution
One scenario at a time:
1. Load the surface skill (`test-guide-api` | `test-guide-cli` | `test-guide-ui`).
2. Before you write a command, check each table, column, header and field name in the source. Make sure that the preconditions of the step are true (for example: the service responds). If not, give the fix first.
3. Show one Step Card per step, in the format of `templates/step-card.md`. Step 1 of a scenario starts with the scenario header (description and what a PASS means, copied from the scenario file). Every step title shows `n / N`; N = number of rows in the Steps table of the scenario file. Every `Expect` is followed by `What it means`: what the step has just done, in plain words (not the raw values). Wait for the user's output.
4. Show the Result Card. Update `Status` and `Result` in the scenario file. Append one line to `log.md`.
Before FAIL, triage: setup/test data, spec, MY OWN command, or system (for example: an empty answer from the UI can be a backend that is down). A wrong command of mine is not a FAIL: fix it, and write it in `Result`. Give ONE check command.
If the spec is silent → OPEN ❓, record the question, tell the user before PASS.
Shorten long values (tokens) in the cards and say so.
Bug fix: reproduce on the old code first (must FAIL), then verify on the fix (must PASS).

## Phase 4 · Close
Write report.md from the scenario files. Offer the extras once, in one line: bug draft (/test-bug) and automation (/test-automate). Give the cleanup commands (files and rows that the tests created).
A report that goes online (Jira, PR): one summary comment in the format of that tool (Jira: wiki markup), with the test procedure. No relative paths.

## Resume
Read the session files only. Show the Status Board. Ask the user to run the preflight and
`!git log --oneline <last-commit>..HEAD --stat`. A merge can change the commit, the migration number or the ports.
Map the changed files to scenarios and propose a re-run plan.

## State (trust the files, not chat memory)
`.manual-tests/<session>/` → context.md · scenarios/S<nn>-<slug>.md · log.md · state.env · harness.<ext> · evidence/ · report.md

## Formats (use exactly; no prose outside the cards except a one-line clarification)

### Scenario list
```
## Scenarios · <feature>
| Key | Title | Surface | Covers |
Coverage: R1→S01,S03 · R2→S02
❓ Open questions: …
```

### Step Card
Use `templates/step-card.md` exactly. Key points: step 1 shows the scenario header (`About this scenario`, `A PASS means`); every step title shows `n / N`; every `Expect` is followed by `What it means` (what the step has just done, in plain words).

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
