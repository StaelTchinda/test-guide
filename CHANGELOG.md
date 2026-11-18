# Changelog
## 0.2.0
Learnings from real sessions.
- New skill `test-guide-harness`: one visible harness file, `state.env`, `save`, helper rules, cleanup.
- New templates: `templates/scenario.md` (one file per scenario) and `templates/step-card.md` (`n / N` counter, "What it means").
- New Phase 0: environment and baseline, harness approval, read-only preflight.
- New golden rules: glass box, one window, one command per step, approval before writes, self-contained cards, no actions outside the plan, warn before writes to shared resources, simple explanations.
- Scenarios: rules from ticket + parent + spec + code; keep only critical ones; split mixed surfaces; reset data, not the database; absolute paths of files.
- Execution: check names in the source and the preconditions; triage includes own command errors.
- API: Windows PowerShell 5.1 notes (`curl.exe`, JSON quoting), time-window calls in one command.
- Jira: rules without numbered AC; decisions from comments; online reports in Jira format.
## 0.1.0
- Initial release: test-guide agent, 7 skills, 6 commands, npx installer.
