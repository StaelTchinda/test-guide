# S01 · Owner deletes own todo

| Key | Surface | Status | Specs |
| --- | ------- | ------ | ----- |
| S01 | API     | PASS   | R1    |

**Description:** Alice creates a todo, then deletes it. We check the status and the database.

**A PASS means:** A user can delete their own todo, and it is really gone.

**Proves:** Catches a route that returns 204 but does not delete the row (for example a soft delete that the spec does not allow).

**Spec source:** R1 — docs/api.md §Delete

## Preconditions

API running (`api_up`), seed data loaded, `TOKEN_ALICE` in `state.env`.
`<H>` = `. ./.manual-tests/todo-delete/harness.sh`

## Steps

| #   | What it does                                            |
| --- | ------------------------------------------------------- |
| 1   | Alice creates a todo `tg-<n>`; save its id as `TODO_ID` |
| 2   | Alice deletes the todo; show only the HTTP status       |
| 3   | Read the database: is the row gone?                     |

## Expected

1. Status 201, an id is saved → means: a new todo of Alice now exists.
2. `204` → means: the server accepted the delete.
3. `0` → means: the todo is really removed from the database.

## Result

2026-11-18 10:12 · commit a1b2c3d

1. `201`, `saved TODO_ID` (17)
2. `204`
3. `0`

PASS.
