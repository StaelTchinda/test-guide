---
name: test-guide-api
description: Step guidance for MANUAL HTTP/REST API checks in a test-guide session. Not for automated tests.
license: MIT
---
- Always print the status: `curl -s -w "\n%{http_code}" …`. Add `-i` only when headers matter.
- Keep output small with `| jq '.field'`. Ask for the full output only if a check fails.
- Secrets/IDs come from env vars (`$TOKEN_X`). If one is missing, tell the user how to create it.
- Side effects: run a read-only check (SELECT/GET) BEFORE and AFTER the call.
- Check: status, required fields, no extra/sensitive fields, error body format, idempotency.
