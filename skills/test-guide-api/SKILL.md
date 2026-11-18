---
name: test-guide-api
description: Step guidance for MANUAL HTTP/REST API checks in a test-guide session. Not for automated tests.
license: MIT
---
- Use the real tool: `curl` (on Windows PowerShell 5.1 use `curl.exe`; `curl` is an alias). Show what each flag does in "What this does".
- Print the status always. `-s -i` shows status line, headers and body. `-o NUL -w "%{http_code}"` shows only the status. Use `-i` when headers matter.
- Windows PowerShell 5.1: pass JSON as `-d '{\"a\":1}'` (backslash before each double quote). `$r = curl.exe -s -i …` gives lines: `$r[0]` is the status line, `$r[-1]` is the body. Read a header with `Select-String`. A new line in a double-quoted string is `` `n ``.
- Tokens and ids go to `state.env` with `save`. Shorten them in the cards.
- Side effects: read the database BEFORE and AFTER the call (a SELECT with the real table and column names, checked in the source).
- A rule with a time window (throttle, expiry): put all calls of the window into one command.
- Check: status, required fields, no extra/sensitive fields, error body format, idempotency (the same call twice).
- Keep output small. Ask for the full output only if a check fails.
