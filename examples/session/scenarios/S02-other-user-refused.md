# S02 · Other user cannot delete the todo

| Key | Surface | Status | Specs |
| --- | ------- | ------ | ----- |
| S02 | API     | FAIL   | R2    |

**Description:** Alice creates a todo. Bob tries to delete it. We check the status and the database.

**A PASS means:** Nobody can delete the todos of another user.

**Proves:** Catches a route that checks the login but not the owner.

**Spec source:** R2 — docs/api.md §Delete, src/routes/todos.ts:42

## Preconditions

API running, `TOKEN_ALICE` and `TOKEN_BOB` in `state.env`.
`<H>` = `. ./.manual-tests/todo-delete/harness.sh`

## Steps

| #   | What it does                                            |
| --- | ------------------------------------------------------- |
| 1   | Alice creates a todo `tg-<n>`; save its id as `TODO_ID` |
| 2   | Bob deletes Alice's todo; show only the HTTP status     |
| 3   | Read the database: does the row still exist?            |

## Expected

1. Status 201, an id is saved → means: a new todo of Alice now exists.
2. `403` → means: the server refused Bob.
3. `1` → means: Alice's todo is still there.

## Result

2026-11-18 10:20 · commit a1b2c3d

1. `201`, `saved TODO_ID` (18)
2. `204` (expected `403`)
3. `0` (expected `1`)

Triage:

- Setup: the tokens are correct. `curl -s $BASE/me -H "Authorization: Bearer $TOKEN_BOB"` returns `bob`.
- My command: correct (Bob's token, Alice's todo id).
- System: `src/routes/todos.ts:42` deletes by `id` only. It does not check `owner_id`.

FAIL: Bob deleted Alice's todo.
