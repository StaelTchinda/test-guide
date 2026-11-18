# Jira ticket → context

Use when a Jira key is given. Use the Jira tools (for example a Jira MCP server). If there are none, ask the user to paste the acceptance criteria.

- Fetch only: summary, description, acceptance criteria, and linked issues (titles only). Also read the parent ticket.
- Each acceptance criterion → `[Rn] … — KEY AC#`.
- No numbered AC: take the rules from the sections like Work, Tests and Exit criteria, and name the section as the source.
- Comments: skip them, except for a sub-task or a ticket that mentions re-scope or a decision. Those comments can change the scope. Take only the decisions.
- Linked bugs → regression scenario candidates.
