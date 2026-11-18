# Context · todo-delete

- Session folder: `.manual-tests/todo-delete/`
- `$REPO`: `~/src/todo-api` (system under test)
- Commit: `a1b2c3d` (branch `feature/delete-todo`)
- Environment: local. Database: `todo_test` on `localhost:5432` (local).

## System under test

- Start: `npm run dev` in `$REPO` → `http://localhost:3000`
- Auth: `Authorization: Bearer <token>`. `POST /login` returns a token.
- Test data: users `alice` (owner) and `bob` (other user), created by `npm run seed`.

## Rules

- [R1] `DELETE /todos/:id` by the owner returns 204 and removes the row. — docs/api.md §Delete
- [R2] `DELETE /todos/:id` by another user returns 403. The row stays. — docs/api.md §Delete, src/routes/todos.ts:42
- [R3] `DELETE /todos/:id` without a token returns 401. — src/middleware/auth.ts:10
- [R4] `DELETE` of an unknown id returns 404. — docs/api.md §Errors

## Gaps

- The spec does not say if a second `DELETE` of the same todo returns 404 or 204. → Open question.

## Helpers

None.
