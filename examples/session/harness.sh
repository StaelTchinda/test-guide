# Harness of the session todo-delete. Load it at the start of every step: . ./harness.sh

# 1. Fixed values
REPO=~/src/todo-api
SESSION=.manual-tests/todo-delete
STATE=$SESSION/state.env
LOG=$SESSION/server.log
BASE=http://localhost:3000

# 2. Load state.env: each KEY=VALUE line becomes a variable
[ -f "$STATE" ] && set -a && . "$STATE" && set +a

# 3. save KEY VALUE: write to state.env (replace the old value) and set the variable
save() {
  touch "$STATE"
  grep -v "^$1=" "$STATE" > "$STATE.tmp"; mv "$STATE.tmp" "$STATE"
  echo "$1=$2" >> "$STATE"
  export "$1=$2"
  echo "saved $1"
}

# 4. Start, stop and read the log of the system under test (runs in the background, output to $LOG)
api_up()   { (cd "$REPO" && nohup npm run dev > "$OLDPWD/$LOG" 2>&1 &); echo "started, log: $LOG"; }
api_down() { kill "$(lsof -t -i :3000)" && echo "stopped"; }
api_logs() { tail -n 20 "$LOG"; }

# 5. Query the test database
sql() { psql -h localhost -U todo -d todo_test -At -c "$1"; }
