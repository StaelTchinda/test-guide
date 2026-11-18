# Report · todo-delete

Feature: delete a todo · Commit: `a1b2c3d` · Date: 2026-11-18

**Summary:** ✅ 2 · ❌ 1 · ❓ 1 · ⏭ 0

| #   | Scenario                          | Result  | Evidence                              |
| --- | --------------------------------- | ------- | ------------------------------------- |
| S01 | Owner deletes own todo            | ✅ PASS | `204`, row count `0`                  |
| S02 | Other user cannot delete the todo | ❌ FAIL | `204` instead of `403`, row count `0` |
| S03 | Delete without a token            | ✅ PASS | `401`                                 |
| S04 | Delete the same todo twice        | ❓ OPEN | second call `404`; spec silent        |

## Failures

- **S02:** another user can delete a todo. `src/routes/todos.ts:42` deletes by `id` only and does not check `owner_id`. Severity (proposal): high, data loss.

## Open questions

- **S04:** must a second `DELETE` of the same todo return `404` or `204`? The system returns `404`. The spec says nothing.

## Setup / test-data issues

None.

## Cleanup

```bash
. ./.manual-tests/todo-delete/harness.sh; sql "DELETE FROM todos WHERE title LIKE 'tg-%'"; api_down
```
