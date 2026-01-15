---
name: setup-hooks
description: Generate tenet verification script and install pre-commit hook
---

# Setup Hooks

Generate `.tenets-verify.sh` and install git pre-commit hook.

## Pre-flight

Check current state:

1. Verify AGENTS.md exists with Tenets section
2. Check if `.tenets-verify.sh` already exists
3. Check if `.git/hooks/pre-commit` already exists

**If no tenets:**
> No tenets found. Run `/governor:setup` first.

**If files exist:**
> Existing files found:
> - `.tenets-verify.sh`: Yes/No
> - `.git/hooks/pre-commit`: Yes/No
>
> Overwrite? (y/n)

## Generate

### 1. Write `.tenets-verify.sh`

Write to project root:

```bash
#!/bin/bash
set -e

CONFIDENCE_THRESHOLD=${TENET_CONFIDENCE:-50}

# Get staged files
staged=$(git diff --cached --name-only --diff-filter=ACM)

# Skip if no staged files
if [ -z "$staged" ]; then
  echo "No staged files to verify."
  exit 0
fi

# Invoke Claude with the skill
result=$(claude -p "Invoke Skill tool with skill='governor:verify-compliance'.
Staged files to check:
$staged" \
  --model haiku \
  --output-format json \
  --json-schema '{"type":"object","properties":{"compliant":{"type":"boolean"},"violations":{"type":"array","items":{"type":"object","properties":{"tenet":{"type":"string"},"reason":{"type":"string"},"confidence":{"type":"integer","minimum":1,"maximum":100}},"required":["tenet","reason","confidence"]}}},"required":["compliant","violations"]}')

# Filter violations by confidence
violations=$(echo "$result" | jq --argjson threshold "$CONFIDENCE_THRESHOLD" \
  '[.violations[] | select(.confidence >= $threshold)]')

count=$(echo "$violations" | jq 'length')

if [ "$count" -gt 0 ]; then
  echo "✗ Tenet violations found (confidence >= $CONFIDENCE_THRESHOLD):"
  echo "$violations" | jq -r '.[] | "[\(.tenet)] (\(.confidence)%) \(.reason)"'
  exit 1
fi

echo "✓ Tenet verification passed."
exit 0
```

### 2. Make executable

```bash
chmod +x .tenets-verify.sh
```

### 3. Write `.git/hooks/pre-commit`

```bash
#!/bin/bash
exec ./.tenets-verify.sh
```

### 4. Make hook executable

```bash
chmod +x .git/hooks/pre-commit
```

## Summary

> Created `.tenets-verify.sh`
> Installed `.git/hooks/pre-commit`
>
> **Usage:**
> - Commits will be verified automatically
> - Manual check: `./tenets-verify.sh`
> - Adjust sensitivity: `TENET_CONFIDENCE=80 ./tenets-verify.sh`
