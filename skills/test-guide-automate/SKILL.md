---
name: test-guide-automate
description: Turn PASSED test-guide scenarios into automated tests following the repo's conventions. Use only on /test-automate or explicit request.
license: MIT
---
- Find the existing test framework and read ONE example test.
- Write one test per scenario, named `S<n>_<slug>`, reusing the commands and expectations from log.md.
- Ask before writing files. End with the command the user should run to execute the tests. Don't run it.
