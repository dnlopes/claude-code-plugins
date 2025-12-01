---
name: sequential-thinking
description: Use when facing complex problems that benefit from structured step-by-step reasoning, hypothesis testing, or exploring multiple solution paths
---

# Sequential Thinking

Use the `sequential_thinking` tool to work through complex problems systematically. This tool helps you decompose problems, track your reasoning, revise earlier conclusions, and explore alternative approaches.

## When to Use Sequential Thinking

**Good candidates:**
- Problems with unclear scope or multiple valid approaches
- Analysis requiring course correction as understanding deepens
- Multi-step tasks that need extended context maintenance
- Situations requiring filtering of irrelevant information
- Debugging complex issues where the root cause isn't obvious
- Design decisions with tradeoffs to evaluate

**Not needed for:**
- Simple, well-defined tasks with obvious solutions
- Quick lookups or straightforward code changes
- Tasks you can complete in one or two steps

## How It Works

The `sequential_thinking` tool tracks a chain of reasoning steps. Each step has:

- **thought**: Your current reasoning (what you're thinking about)
- **thoughtNumber**: Which step this is (1, 2, 3...)
- **totalThoughts**: Your estimate of total steps needed (can be adjusted)
- **nextThoughtNeeded**: Whether you need to continue thinking

## Basic Workflow

### Step 1: Start the Chain

Begin with thoughtNumber 1. Estimate totalThoughts (you can adjust later).

```
sequential_thinking(
  thought: "Let me understand the problem. The user wants X, which involves Y and Z...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
)
```

### Step 2: Continue Reasoning

Each subsequent call advances your thinking:

```
sequential_thinking(
  thought: "Now that I understand the requirements, I see three possible approaches...",
  thoughtNumber: 2,
  totalThoughts: 5,
  nextThoughtNeeded: true
)
```

### Step 3: Finish When Done

Set `nextThoughtNeeded: false` when you've reached a conclusion:

```
sequential_thinking(
  thought: "Based on my analysis, the best approach is X because...",
  thoughtNumber: 5,
  totalThoughts: 5,
  nextThoughtNeeded: false
)
```

## Advanced Features

### Revising Earlier Thoughts

If you realize an earlier step was wrong, revise it:

```
sequential_thinking(
  thought: "I need to reconsider step 2. The approach I outlined won't work because...",
  thoughtNumber: 4,
  totalThoughts: 6,
  nextThoughtNeeded: true,
  isRevision: true,
  revisesThought: 2
)
```

### Branching into Alternative Paths

Explore multiple solutions simultaneously:

```
sequential_thinking(
  thought: "Let me explore an alternative approach from step 3...",
  thoughtNumber: 5,
  totalThoughts: 7,
  nextThoughtNeeded: true,
  branchFromThought: 3,
  branchId: "alternative-approach"
)
```

### Requesting More Steps

If you need more steps than originally estimated:

```
sequential_thinking(
  thought: "This is more complex than expected. I need to analyze X further...",
  thoughtNumber: 5,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  needsMoreThoughts: true
)
```

## Example: Debugging a Complex Issue

```
Step 1: "The user reports that authentication fails intermittently. Let me list what I know and what I need to investigate..."

Step 2: "Looking at the auth flow, there are three components involved: the token service, the session manager, and the cache layer..."

Step 3: "I'll examine the token service first. The error suggests tokens are sometimes invalid..."

Step 4: "Found that the token service uses a cache with 5-minute TTL, but the tokens have 4-minute expiry. This could cause race conditions..."

Step 5 (revision of 4): "Wait, I misread the config. The token expiry is 5 minutes, same as the cache. Let me look at the session manager instead..."

Step 6: "The session manager has a bug: it doesn't check token validity before using cached values. This explains the intermittent failures."

Step 7 (final): "Root cause identified. The fix is to add token expiry validation in session manager before using cached tokens."
```

## Tips for Effective Use

1. **Be explicit in your thoughts** - Write out your reasoning clearly, not just conclusions
2. **Revise when wrong** - Don't pretend earlier steps were correct; use `isRevision`
3. **Branch to explore** - When multiple approaches seem viable, use branching
4. **Adjust estimates** - Use `needsMoreThoughts` if problems are more complex than expected
5. **Filter noise** - Use thoughts to explicitly note what information is NOT relevant
6. **Conclude definitively** - End with a clear decision or recommendation
