---
name: test-guide
description: Guided manual testing session. Use when the user wants to manually test a feature, endpoint, CLI or UI, verify a bug fix, or resume a test session. Builds context, designs evidence-based scenarios, then guides the user step by step while the USER runs every command.
license: MIT
---
# Guided manual testing

## Golden rule
You plan, explain and compare. The USER runs every command (`!cmd`). Never execute commands yourself.

## Phase 1 · Context
Collect only what's needed to test the feature:
- System under test: start command, URL/binary, auth, test data
- Rules from the spec/code: `[Rn] rule — source (file§ / file:line / KEY AC#)`
- Gaps: where the spec is silent or the code ≠ the spec
If a Jira key is given, load `test-guide-jira`. Keep the brief to ≤ 40 lines.
Show the brief and ask: "Correct / missing?"

## Phase 2 · Scenarios
Write the Scenario Table. Rules:
- Every [Rn] is covered by at least one scenario. Add a Coverage line.
- Order: happy → auth → validation/edge → negative → regression. Use 5–10 rows.
- "Why" = which wrong implementation this scenario would catch, in one sentence.
- Put ambiguities under ❓ Open questions. Never guess.
The user may add, remove or reorder scenarios. Wait for their OK.

## Phase 3 · Execution
One scenario at a time:
1. Load the surface skill for this scenario (`test-guide-api` | `test-guide-cli` | `test-guide-ui`).
2. Show the Step Card. Wait for the user's output.
3. Show the Result Card and append a block to log.md.
Before calling something FAIL, triage: test data/setup, spec, or system? Give ONE check command.
If the spec is silent → OPEN ❓ and record the question.
Bug fix: reproduce on the old code first (must FAIL), then verify on the fix (must PASS).

## Phase 4 · Close
Write report.md. Offer the extras once, in one line: bug draft (/test-bug) and automation (/test-automate).

## Resume
Read the session files only. Show the Status Board. Ask the user to run
`!git log --oneline <last-commit>..HEAD --stat`, map the changed files to scenarios, and propose a re-run plan.

## State (write after every result; trust the files, not chat memory)
`.manual-tests/<session>/` → context.md · scenarios.md · log.md · report.md · evidence/

## Formats (use exactly; no prose outside the cards except a one-line clarification)

### Scenario Table
```
## Scenarios · <feature>
| # | Scenario | Surface | Expected | Covers | Why it proves correctness | Status |
Coverage: R1→S1,S3 · R2→S2
❓ Open questions: …
```

### Step Card
```
## ▶ S<n> · <title>          [<done>/<total> · ✅<p> ❌<f> ❓<q>]
**Surface:** API | CLI | UI    **Covers:** <Rn>
### Do
1. <step; commands in a bash block, prefixed with !>
### Expect
- <observable>
### Why this proves it
<one sentence>
```

### Result Card
```
## S<n> · PASS ✅ | FAIL ❌ | OPEN ❓
| Check | Expected | Actual | |
### Next
<one line>
```

### Status Board (after every 3 scenarios and on request)
```
## 📋 <session> · <done>/<total>
| # | Scenario | Surface | Result |
```

### log.md block
```
## S<n> · <result> · <yyyy-mm-dd hh:mm> · commit <sha>
Command · Expected · Actual (trimmed) · Evidence · Triage notes
```

### report.md
Header (feature, commit, date) · Summary `✅ · ❌ · ❓ · ⏭` · results table with evidence · Failures · Open questions · Setup/test-data issues.
