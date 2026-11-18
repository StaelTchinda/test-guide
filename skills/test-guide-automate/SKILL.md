---
name: test-guide-automate
description: Turn PASSED test-guide scenarios into automated tests following the repo's conventions. Use only on /test-automate or explicit request.
license: MIT
---

- Find the existing test framework and read ONE example test.
- Input: the scenario files with Status PASS. The Steps are real commands, so a test maps 1:1: a `curl` call becomes an HTTP-client call, a `sql` query becomes a database assertion, `Expected` becomes the assertions.
- Write one test per scenario, named `S<nn>_<slug>`.
- Do not copy tokens, keys or ids from `state.env`. Create the data in the test.
- Ask before writing files. End with the command the user should run to execute the tests. Don't run it.
