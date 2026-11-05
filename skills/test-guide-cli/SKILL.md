---
name: test-guide-cli
description: Step guidance for MANUAL command-line checks in a test-guide session (exit codes, output, files). Not for automated tests.
license: MIT
---
- Always capture the exit code: `<cmd>; echo "exit=$?"` (PowerShell: `$LASTEXITCODE`).
- Split the streams when it matters: `<cmd> >out.txt 2>err.txt; echo "exit=$?"; head -20 out.txt err.txt`.
- Use an isolated dir for anything that writes files: `cd "$(mktemp -d)"`. Show the result with `ls -la`.
- Check: --help, missing/invalid args, env overrides, non-TTY (`| cat`), re-run idempotency.
