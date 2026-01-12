---
name: debugging-methodology
description: Use this skill when debugging any technical issue. It provides a systematic 4-phase framework for root cause analysis that prevents symptom-fixing and ensures thorough investigation.
---

# Debugging Methodology

A systematic framework for debugging ANY technical issue. The goal is always to find and fix the root cause, never to fix symptoms or add workarounds.

## Core Principles

- ALWAYS find the root cause of any issue you are debugging
- NEVER fix a symptom or add a workaround instead of finding a root cause
- Speed is not an excuse - doing it right is better than doing it fast

## Phase 1: Root Cause Investigation

Complete this phase BEFORE attempting any fixes.

### Read Error Messages Carefully

- Don't skip past errors or warnings - they often contain the exact solution
- Copy the full error message for reference
- Look for file paths, line numbers, and specific error codes

### Reproduce Consistently

- Ensure you can reliably reproduce the issue before investigating
- Document the exact steps to reproduce
- Note any conditions that affect reproduction (timing, data, environment)

### Check Recent Changes

- What changed that could have caused this?
- Review git diff and recent commits
- Consider dependency updates, config changes, environment changes

## Phase 2: Pattern Analysis

### Find Working Examples

- Locate similar working code in the same codebase
- Look for patterns that succeed where yours fails

### Compare Against References

- If implementing a pattern, read the reference implementation completely
- Don't assume you know how it works - verify

### Identify Differences

- What's different between working and broken code?
- Focus on subtle differences in configuration, ordering, or initialization

### Understand Dependencies

- What other components/settings does this pattern require?
- Are there implicit dependencies not documented?

## Phase 3: Hypothesis and Testing

### Form Single Hypothesis

- What do you think is the root cause?
- State it clearly and specifically
- Example: "The database connection times out because the pool size is too small for concurrent requests"

### Test Minimally

- Make the smallest possible change to test your hypothesis
- Change ONE thing at a time
- Avoid shotgun debugging (changing multiple things hoping one works)

### Verify Before Continuing

- Did your test work?
- If not, form a new hypothesis - don't add more fixes on top
- If yes, verify the fix is complete and doesn't introduce new issues

### When You Don't Know

- Say "I don't understand X" rather than pretending to know
- Ask for help when stuck
- Document what you've tried and ruled out

## Phase 4: Implementation Rules

### Testing Requirements

- ALWAYS have the simplest possible failing test case
- If there's no test framework, write a one-off test script
- Verify the fix with a test before considering it complete

### Fix Discipline

- NEVER add multiple fixes at once
- NEVER claim to implement a pattern without reading it completely first
- ALWAYS test after each change

### When Fixes Don't Work

- If your first fix doesn't work, STOP and re-analyze
- Don't add more fixes hoping to stumble on the solution
- Return to Phase 1 or Phase 2 with new information

## Anti-Patterns to Avoid

| Anti-Pattern | What to Do Instead |
|--------------|-------------------|
| Shotgun debugging | Change one thing at a time |
| Copy-paste from Stack Overflow | Understand why the solution works |
| "It works on my machine" | Identify environment differences |
| Reverting to "last known good" | Find and fix the actual cause |
| Adding workarounds | Fix the root cause |
| Ignoring intermittent failures | Investigate race conditions or timing |
