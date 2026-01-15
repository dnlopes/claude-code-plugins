---
name: verify-compliance
description: Verify staged code changes comply with project tenets
---

# Verify Compliance

Check staged files against tenets defined in AGENTS.md.

## Input

You receive a list of staged file paths in the prompt.

## Process

1. **Read AGENTS.md** - Extract all tenets (T1, T2, etc.) with their descriptions
2. **Read staged files** - Use Read tool to get content of each file
3. **For each tenet** - Analyze whether any staged file violates it
4. **Assess confidence** - Only report violations you're confident about

## Guidelines

- **Be specific** - Include file path and what specifically violates the tenet
- **Be conservative** - When uncertain, assign lower confidence
- **Read thoroughly** - Check imports, function contents, file locations
- **Confidence scoring:**
  - **90-100**: Clear, unambiguous violation (e.g., forbidden import present)
  - **70-89**: Likely violation, minor ambiguity
  - **50-69**: Possible violation, needs human review
  - **1-49**: Uncertain, might be false positive

## Output

Return JSON (enforced by --json-schema):

```json
{
  "compliant": true/false,
  "violations": [
    {"tenet": "T1", "reason": "file.go imports forbidden package", "confidence": 95}
  ]
}
```

If no violations, return: `{"compliant": true, "violations": []}`
