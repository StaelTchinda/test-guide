---
name: test-guide-jira
description: Turn a Jira issue (via a Jira MCP server) into test-guide context. Use only when a Jira key is given.
license: MIT
---

- Fetch only: summary, description, acceptance criteria, and linked issues (titles only).
- Each acceptance criterion → `[Rn] … — KEY AC#`.
- No numbered AC: take the rules from the sections like Work, Tests and Exit criteria, and name the section as the source.
- Comments: skip them, except for a sub-task or a ticket that mentions re-scope or a decision. Those comments can change the scope. Take only the decisions.
- Linked bugs → regression scenario candidates.
- If no Jira tools are available, ask the user to paste the acceptance criteria.
