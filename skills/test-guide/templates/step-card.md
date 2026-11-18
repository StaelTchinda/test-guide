# Step Card template

Use this exact format for every step. Replace each `<...>`.
N = the number of rows in the "Steps" table of the scenario file. Show it in every step title as `n / N`.
Step 1 of a scenario also shows the scenario header. Later steps do not.

## Step 1 of a scenario (scenario header + step)

````markdown
## ▶ S<nn> · <title>          [<done>/<total> · ✅<p> ❌<f> ❓<q>]
**Surface:** API | CLI | UI    **Covers:** <Rn>
**About this scenario:** <"Description" of the scenario file, 1-2 sentences>
**A PASS means:** <"A PASS means" of the scenario file: plain words, what the system is then proven to do>

### Step 1 / <N> · <name>
```<shell>
<harness line>; <command>
```
**What this does:** <meaning of each part of the command>
**Expect:** <the observable output or values>
**What it means:** <what this step has just done, in plain words>
````

## Step 2 to N (step only)

````markdown
<one line: verdict of the previous step, with the key value>

### Step <n> / <N> · <name>
```<shell>
<harness line>; <command>
```
**What this does:** <meaning of each part of the command>
**Expect:** <the observable output or values>
**What it means:** <what this step has just done, in plain words>
````

## Rules
- **Step counter:** always `n / N`. If you add or remove a step, change the "Steps" table of the scenario file first, then N.
- **What it means (step level):** say what the step has just done to the system or the data, in plain words. Write "an admin user now exists", not "CREATED - COUNT: 1 - TYPE: ROLE_ADMIN". One or two short sentences. Explain each technical term at its first use. Do not repeat the raw values of "Expect".
- **A PASS means (scenario level):** say what the whole scenario proves about the behavior of the system for the user. Example: "Only admins can open the page. All other users are refused."
- Shorten long values (tokens, JSON) and say so.
- The command is the full command. No hidden logic.
