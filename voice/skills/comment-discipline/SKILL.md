---
name: comment-discipline
description: Governs when to add comments while writing or editing code, in any language. Comments exist only to capture non-obvious nuances — hidden constraints, subtle invariants, workarounds for a specific bug, behavior that would surprise a reader. Never to restate what the code already says, never to narrate the current task or a decision made during it, and never as a systematic habit applied to every function or block. Load before writing new code, editing existing code, or reviewing a diff for comment quality.
---

# Comment discipline

Default to writing no comments. Add one only when the WHY is non-obvious and would not be recoverable by reading the code itself.

## The rule

Before adding a comment, ask: **if I deleted this comment, would a competent reader be confused?**

- No → don't write it.
- Yes → write it, and keep it to the one non-obvious thing, not a summary of the surrounding code.

## What a comment is for

Only these:

- A hidden constraint the code must satisfy but doesn't display (e.g. "must run before X due to ordering in the upstream API").
- A subtle invariant that isn't visible from the types or names.
- A workaround for a specific external bug or platform quirk, ideally with a reference (ticket, issue link, upstream bug ID).
- Behavior that looks wrong or redundant but is intentional, and would likely get "fixed" into a regression otherwise.

## What a comment is never for

- **Restating the code.** Well-named identifiers already say what the code does; a comment repeating that is noise.
  ```python
  # increment the counter
  counter += 1
  ```
- **Narrating the current task.** Comments must not reference the fix, the ticket, the caller, or the conversation that produced the change ("added for the new onboarding flow", "per user request", "fix for bug #123"). That context belongs in the commit message or PR description, not the file — it rots the moment the surrounding code changes again.
- **Recording a decision instead of a constraint.** "We chose Redis here" is a decision; it's not load-bearing information for the next reader unless *not knowing it* would cause them to break something. If the decision has a consequence the code doesn't show, comment the consequence, not the decision.
- **Habitual coverage.** Every function does not need a comment. Every block does not need a comment. A file that is easy to read start-to-finish needs zero comments, and that's the expected common case, not a gap to fill in.
- **Multi-line docstring blocks** for something a one-line signature and a good name already explain.

## Examples

Bad — restates the code:
```javascript
// loop through users and check if active
for (const user of users) {
  if (user.active) { ... }
}
```

Bad — narrates the task instead of the code:
```javascript
// Changed to Set for O(1) lookup as requested in review
const seen = new Set();
```

Good — captures a non-obvious constraint:
```javascript
// API returns results unordered above 100 rows; re-sort client-side
const sorted = results.sort(byCreatedAt);
```

Good — flags a deliberate-looking oddity that would otherwise get "cleaned up":
```python
# retry count starts at 1, not 0 — upstream treats 0 as "infinite retries"
retry_count = 1
```

## Applying this during review

When reviewing a diff or an existing file for comment quality, flag:
1. Comments that just restate the adjacent line or block.
2. Comments referencing "this PR", "the fix", "as discussed", ticket numbers, or the user's request.
3. Comments present on every function/block regardless of whether any of them carry non-obvious information.
4. Missing comments only where a real hidden constraint or workaround exists and nothing else in the code surfaces it.

No exceptions for "just to be safe" or "future readers might appreciate it" — those are the systematic-commenting instinct this skill exists to override.
