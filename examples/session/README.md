# Example session

A complete, invented test-guide session: the files that the skill writes in `.manual-tests/<session>/`.

- Feature under test: in a small todo REST API, only the owner of a todo can delete it.
- Shell: bash. Tools: `curl`, `psql`.
- All names, tokens and values are fake. The session has 4 scenarios; 2 scenario files are included.

| File                                  | Written in | Content                                                 |
| ------------------------------------- | ---------- | ------------------------------------------------------- |
| `context.md`                          | Phase 1    | System under test, rules `[Rn]` with sources, gaps      |
| `harness.sh`                          | Phase 0    | The setup file. Every step starts with `. ./harness.sh` |
| `state.env`                           | Phase 3    | Values that steps save with `save` (tokens, ids)        |
| `scenarios/S01-owner-deletes-todo.md` | Phase 2, 3 | A passed scenario                                       |
| `scenarios/S02-other-user-refused.md` | Phase 2, 3 | A failed scenario, with triage                          |
| `log.md`                              | Phase 3    | One line per result                                     |
| `report.md`                           | Phase 4    | Summary, results, failures, open questions, cleanup     |
