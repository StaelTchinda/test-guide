---
name: test-guide-harness
description: Rules for the setup file (harness) and the state file of a test-guide session. Use in Phase 0 of a guided manual test, when you write or change the harness or a helper file.
license: MIT
---

The harness is ONE visible file with a few short functions. The user reads it, you explain it, and then it is used. Adapt the shell, tools and language to the system under test. Keep the ideas and the function names.

## Layout

- Session folder in the agent's repo: `.manual-tests/<session>/` holds all files.
- `$REPO` in the harness points to the system under test (it may be a worktree). `context.md` names both in its first lines.
- Every step starts with the harness line (dot-source the file). Each `!` command is a fresh shell.

## Harness content (one short comment per part)

1. Fixed values: `$REPO`, session folder, `state.env`, log file, base URL.
2. Load `state.env`: each `KEY=VALUE` line becomes a variable.
3. `save KEY VALUE`: write to `state.env` (replace the old value) and set the variable.
4. `*_up` / `*_down` / `*_logs`: start, stop and read the log of the system under test.
5. `sql "query"` (or the query tool of the system).
6. One function per action that repeats and is long (example: `upload PATH FILE`).

## Rules

- Explain first: show the file, explain it part by part, wait for "approved". Show later changes as a diff.
- Use the real tool of the system (`curl`, `psql`, the CLI). No wrapper that hides the call.
- One window: start a background process in its own minimized window. Redirect its output inside that window (for example `cmd /c "... > log 2>&1"`). Do NOT use the redirect options of `Start-Process`: the `!` command then never returns. Stop by the listening port, not only by a saved pid.
- State is plain text. The user can read it at any time.
- Secrets, keys and tokens: local test data only. Tell the user where they are stored.
- Preflight (read-only, user runs it): commit, config, database reachable and local, migration head, port free, keys present.

## Helper files (exception)

Allowed only when the system has no real interface for the action (example: no route creates a runtime and its bootstrap token).

- Use the project's own function. One purpose. At most about 40 lines.
- Show it in full, explain it line by line, and wait for "clear" before first use.
- It prints `KEY=VALUE` lines. The step saves them with `save`.
- List every helper in `context.md`.
- A helper or a tip for one machine or one project (a shell alias, a local token file) goes into the project notes (for example the project `AGENTS.md`), not into this skill.

## Cleanup

Keep a list of what the tests create (rows, files, processes). Give the user the cleanup commands at the end.
