---
name: verify-tenets
description: Verify codebase compliance with tenets defined in AGENTS.md
args: "--mode <mode> [--files <files>] [--paths <dirs>] [--base <branch>] [--confidence <N>]"
---

# Verify Tenets

Run thorough tenet compliance verification with formatted output.

## Arguments

| Argument | Description |
|----------|-------------|
| `--mode <mode>` | Scope mode: `files` \| `changed` \| `all` \| `paths` (required) |
| `--files <files>` | File list (required for `files` mode) |
| `--paths <dirs>` | Directory list (required for `paths` mode) |
| `--base <branch>` | Branch to compare against (for `changed` mode, default: main) |
| `--confidence <N>` | Minimum confidence threshold to report (default: 50) |

## Pre-flight

Check AGENTS.md exists:

```bash
test -f AGENTS.md && echo "Found" || echo "Not found"
```

**If not found:**
> No AGENTS.md found. Run `/governor:setup` first.

Check for Tenets section:

```bash
grep -n "^## Tenets" AGENTS.md 2>/dev/null
```

**If no Tenets section:**
> No Tenets section found. Run `/governor:setup` first.

## Determine Parameters

Extract from arguments:

- `--mode`: mode (required)
- `--files`: files list (required if mode=files)
- `--paths`: paths list (required if mode=paths)
- `--base`: base_ref (default: main, only used if mode=changed)
- `--confidence`: confidence_threshold (default: 50)

**Validation:**
- If mode=files and no --files provided: error
- If mode=paths and no --paths provided: error

## Execute

Invoke the `governor:verify-compliance` skill using the Skill tool:

```
Mode: <mode>
Files: <files if mode=files>
Paths: <paths if mode=paths>
Base ref: <base_ref if mode=changed>
Confidence threshold: <confidence_threshold>
```

The skill returns JSON with this structure:

```json
{
  "summary": {
    "compliant": true/false,
    "total_files_checked": N,
    "total_violations": N
  },
  "tenets": [...],
  "scope": {...}
}
```

## Format Output

Parse the JSON and format for human readability.

### If compliant:

```
✓ Tenet Verification Passed

Checked <N> files (<scope description>)
All tenets compliant

─────────────────────────────────────
T1. <Name>
   COMPLIANT
─────────────────────────────────────
T2. <Name>
   COMPLIANT
─────────────────────────────────────
```

### If violations found:

```
✗ Tenet Verification Failed

Checked <N> files (<scope description>)
Found <N> violations across <N> tenets

─────────────────────────────────────
T1. <Name>
   VIOLATED (<N> violations)

   • <file>:<line> (<confidence>%)
     <reason>

   • <file>:<line> (<confidence>%)
     <reason>
─────────────────────────────────────
T2. <Name>
   COMPLIANT
─────────────────────────────────────
```

### Scope description:

- `all` mode: "entire codebase"
- `changed` mode: "changed vs <base_ref>"
- `files` mode: "<N> specified files"
- `paths` mode: "in <paths>"

## Guidelines

1. **Always invoke the skill** - Do not bypass the skill and analyze directly
2. **Format clearly** - Use consistent formatting for easy scanning
3. **Show all tenets** - Include compliant tenets to show full picture
4. **Group by tenet** - Violations grouped under their tenet, not flat list
