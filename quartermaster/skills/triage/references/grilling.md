# Grilling an Under-Specified Issue

When an issue or PR needs fleshing out before it can become an agent brief, interview the reporter/maintainer until you reach a shared understanding — don't guess at the gaps yourself.

## Work in rounds

Map the open questions as a **design tree**: every decision branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask *now* without guessing at answers you haven't heard yet.

Ask the whole frontier in one round: number each question and give your recommended answer.

```
❓ **Q1** - **<question title>**: <question body — may be multiple paragraphs, may include multiple choices>

➡️ <your recommended answer>
```

Wait for answers before the next round. Each round reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. A question whose answer depends on another question still open in this round belongs to a *later* round, not this one.

Finding *facts* is your job, never the reporter's. When a frontier question needs a fact from the environment (codebase, tools), go look it up yourself rather than asking for it. Don't block the round on it — ask everything else in the frontier now, and only the questions genuinely downstream of that lookup wait.

The session is done when the frontier is empty — nothing left silently assumed. Don't write the agent brief until the picture is settled.

## Sharpen the domain terms as you go

While grilling, treat the project's `CONTEXT.md` glossary as live, not just a reference to read (see [domain-docs.md](./domain-docs.md) for how to find it):

- **Challenge conflicts.** If the reporter uses a term that conflicts with `CONTEXT.md`, call it out immediately: "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"
- **Sharpen vague terms.** Propose a precise canonical term for anything fuzzy or overloaded: "You're saying 'account' — do you mean the Customer or the User?"
- **Probe with scenarios.** Invent edge-case scenarios that force precision about the boundary between concepts.
- **Cross-reference the code.** If the reporter's description contradicts what the code actually does, surface it rather than trusting either side blindly.
- **Update `CONTEXT.md` inline** the moment a term resolves — don't batch it. `CONTEXT.md` is a glossary only: no implementation details, no scratch notes.

## Offer an ADR sparingly

Only propose writing an ADR when all three hold:

1. **Hard to reverse** — changing course later would be costly
2. **Surprising without context** — a future reader would ask "why this way?"
3. **A real trade-off** — genuine alternatives existed and one was chosen for specific reasons

If any of the three is missing, skip the ADR — record the decision in the brief instead.
