---
name: test-guide-jira
description: Turn a Jira issue (via a Jira MCP server) into test-guide context. Use only when a Jira key is given.
license: MIT
---
- Fetch only: summary, description, acceptance criteria, and linked issues (titles only). Skip comments unless asked.
- Each acceptance criterion → `[Rn] … — KEY AC#`.
- Linked bugs → regression scenario candidates.
- If no Jira tools are available, ask the user to paste the acceptance criteria.
