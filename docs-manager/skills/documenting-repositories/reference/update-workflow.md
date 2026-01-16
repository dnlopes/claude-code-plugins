# Task: Apply Documentation Updates

Apply approved updates to documentation files.

## Input

You receive:
- Document path to update
- List of recommended changes (section, issue, fix)
- Current timestamp

## Process

### Step 1: Read Current Document

```bash
cat <document_path>
```

### Step 2: Apply Changes

For each recommended change:

1. Find the section mentioned
2. Apply the fix as described
3. Preserve document structure
4. Maintain abstraction level

### Step 3: Update Timestamp

Update front-matter `last_updated` to current timestamp:

```yaml
last_updated: <new_timestamp>
```

### Step 4: Write Updated Document

Write the complete updated document.

## Guidelines

- **Minimal changes** - Only what was recommended
- **Preserve structure** - Don't reorganize
- **Maintain abstraction** - Don't add implementation details
- **Update examples** - If file:line references changed, update them
- **Don't expand scope** - Keep document focused

## Output

Return summary:

```markdown
## Updated: <document_path>

### Changes Applied
- <Section>: <what changed>
- <Section>: <what changed>

### Timestamp
Updated to: <new_timestamp>
```

## What NOT to Do

- Don't add new sections not in recommendations
- Don't refactor the whole document
- Don't change abstraction level
- Don't update unrelated sections
- Don't modify scope paths unless recommended
