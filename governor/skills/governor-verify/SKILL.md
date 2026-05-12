---
name: governor-verify
description: Use when the user wants to check code compliance against tenets defined in AGENTS.md. Supports verifying changed files (default), specific files, specific paths, or the whole codebase, with configurable confidence and severity thresholds. Spawns the tenet-verifier agent for analysis and respects the Tenet Exceptions table plus inline `governor:ignore` comments.
---

# Governor Verify

Check code compliance against the tenets in AGENTS.md.

**REQUIRED:** Load the `tenet-governance` skill for tenet format, severity levels, confidence scoring, and exception syntax.

## When to use

- The user asks to "verify tenets", "check compliance", or "audit tenets"
- Before merging changes — verify the diff against tenets
- During code review — spot architectural violations
- After refactors — confirm no regressions

**Don't use when:**
- No tenets exist — direct the user to `governor-bootstrap`
- The user wants to add/edit/remove tenets — use `governor-manage`

## Critical guidelines

- **You MUST run the `governor:tenet-verifier` agent for the actual analysis.** Don't analyze files yourself in this skill's context — the verifier has a dedicated context window for file reading.
- **You MUST respect exceptions.** Both the Tenet Exceptions table in AGENTS.md and inline `governor:ignore` comments suppress matching violations.
- **You MUST report file:line for each violation.** Without it, the user can't act on findings.
- **You MUST NOT modify any files.** Verification is read-only.

## Workflow

```
Verify Progress:
- [ ] Step 1: Pre-flight (parse tenets and exceptions)
- [ ] Step 2: Determine scope and thresholds
- [ ] Step 3: Spawn tenet-verifier agent
- [ ] Step 4: Render results
```

### Step 1: Pre-flight

```bash
test -f AGENTS.md && grep -q "^## Tenets" AGENTS.md && echo "ok" || echo "missing"
```

**If missing:** `No tenets found. Run the governor-bootstrap skill first.`

Parse AGENTS.md:
- Tenets: ID, name, description, severity
- Exceptions: file → list of excepted tenet IDs

### Step 2: Determine scope and thresholds

Extract options from the user's request (or use defaults):

| Parameter | Values | Default |
|-----------|--------|---------|
| mode | `changed` (default), `files`, `paths`, `all` | `changed` |
| files | explicit list | (required if mode=files) |
| paths | directory list | (required if mode=paths) |
| base | branch name | `main` |
| confidence | 0-100 | 50 |
| severity | `low`, `medium`, `high`, `critical` (minimum) | `low` |

**File discovery by mode:**

| Mode | Method |
|------|--------|
| `changed` (default) | `git diff --name-only <base>...HEAD` |
| `files` | Explicit list from prompt |
| `paths` | Glob code files within specified directories |
| `all` | Glob all code files (respect .gitignore) |

Filter to code files only (exclude images, lockfiles, generated artifacts).

**If the user doesn't specify mode**, ask them to confirm `changed vs main` or specify a different scope.

### Step 3: Spawn tenet-verifier agent

Use the Task tool with `subagent_type: governor:tenet-verifier`:

```
Verify compliance of the following files against these tenets.

**Tenets:**
<For each tenet: ID, name, description, severity>

**Files to verify:**
<List of files in scope>

**Exceptions:**
<file → [tenet IDs] map>

**Thresholds:**
- Confidence minimum: <N>%
- Severity minimum: <level>

Return findings in structured markdown with file:line, confidence score, and
reason for each violation. Respect inline `governor:ignore T<N>` comments.
```

### Step 4: Render results

Aggregate the verifier's findings into per-tenet results.

**Compliant:**

```
✓ Tenet Verification Passed

Scope: <N> files (<mode description>)
Tenets checked: <N> (severity >= <level>)
Confidence threshold: <N>%

─────────────────────────────────────
T1. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
T2. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
```

**Violations found:**

```
✗ Tenet Verification Failed

Scope: <N> files (<mode description>)
Found <N> violations across <N> tenets

─────────────────────────────────────
T1. <Name> [<severity>]
   ✗ VIOLATED (<N> violations)

   • <file>:<line> (<confidence>%)
     <reason>

   • <file>:<line> (<confidence>%)
     <reason>

─────────────────────────────────────
T2. <Name> [<severity>]
   ✓ COMPLIANT
─────────────────────────────────────
T3. <Name> [<severity>]
   ⚠ EXCEPTION (<N> approved)

   • <file>:<line>
     Exception: <reason from AGENTS.md table>
─────────────────────────────────────

Result: FAIL (<N> violations at severity >= <level>)
```

**Scope descriptions:**

| Mode | Description in output |
|------|----------------------|
| changed | "changed vs <base>" |
| files | "<N> specified files" |
| paths | "in <paths>" |
| all | "entire codebase" |

## Usage examples

| Request | Action |
|---------|--------|
| "verify tenets" | mode=changed, base=main, confidence=50, severity=low |
| "verify against develop" | mode=changed, base=develop |
| "verify src/api/handler.go" | mode=files, files=src/api/handler.go |
| "verify src/domain and src/api" | mode=paths, paths=src/domain,src/api |
| "verify the whole codebase" | mode=all |
| "verify with high confidence" | confidence=75 |
| "verify only critical tenets" | severity=critical |

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Analyzing files in this skill's own context | Always delegate to the `tenet-verifier` agent — it has the dedicated context budget. |
| Reporting violations on excepted files | Build the exception map from AGENTS.md and inline comments BEFORE handing files to the verifier. |
| Reporting low-confidence noise | Apply the confidence threshold; default 50% filters out most false positives. |
| Treating "exception" as "violation" in summary counts | Exceptions are reported separately and don't count toward the violation total. |
| Missing the file:line in violation output | Every violation must include `file:line`. If the verifier returns one without, ask it to re-report with the location. |

## Reference

- **[tenet-governance](../tenet-governance/SKILL.md)** — tenet format, severity levels, confidence scoring, exception syntax
- **[verification-patterns](../tenet-governance/reference/verification-patterns.md)** — language-specific detection patterns
