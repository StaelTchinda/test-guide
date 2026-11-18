---
name: test-guide-ui
description: Step guidance for MANUAL browser/UI checks in a test-guide session (click paths, visible states, network, screenshots). Not for automated tests.
license: MIT
---
- The user clicks. Write numbered click paths using visible labels ("Click **Save**").
- Expectations must be observable: text, element state, URL, and the network call (DevTools → Network: method, path, status).
- Evidence: the user reports what they see, or saves a screenshot to `.manual-tests/<session>/evidence/`.
- Optional helpers: `!npx playwright screenshot <url> <file>`, `!npx playwright codegen <url>`. Show them like any helper (explain first).
- Second window or browser: allowed only when the user must use a GUI (login, SSO). Ask first, give the reason, and write it in the scenario.
- Check: loading/empty/error states, keyboard navigation, refresh/back, session expiry.
