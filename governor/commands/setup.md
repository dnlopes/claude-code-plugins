---
name: setup
description: Discover and create initial tenets for a project by analyzing the codebase
---

# Setup Tenets

Discover and create initial tenets for a project.

## Pre-flight

Check current state:

```bash
test -f AGENTS.md && echo "AGENTS.md exists" || echo "AGENTS.md not found"
```

If AGENTS.md exists, check for Tenets section:

```bash
grep -n "^## Tenets" AGENTS.md 2>/dev/null && echo "Tenets section exists" || echo "No Tenets section"
```

**If tenets exist:**
> Tenets section already exists. Would you like to:
> 1. **Replace** - Remove existing and create new
> 2. **Add** - Keep existing and add more
> 3. **Cancel**

**If no AGENTS.md or no tenets:** Proceed to Explore.

## Explore

Use the Task tool with subagent_type='tenet-validator' to analyze the codebase:

```
Explore this codebase to discover architectural tenets (guiding principles).

Focus on ARCHITECTURAL CONSTRAINTS and DESIGN DECISIONS, not tooling or linters.

Look for patterns like:

1. **Layer dependencies** - Which layers/packages can import which others?
   - Does domain/core avoid importing infrastructure?
   - Are there clear boundaries between layers?

2. **Data access patterns** - How is the database accessed?
   - Is there a repository pattern or data access layer?
   - Do handlers/controllers access DB directly or through services?

3. **Separation of concerns** - Where does business logic live?
   - Is HTTP/API layer thin (just routing and serialization)?
   - Is business logic concentrated in specific packages?

4. **Component boundaries** - What are the major components and their responsibilities?
   - Are there clear interfaces between components?
   - What must NOT depend on what?

5. **Error handling patterns** - How are errors propagated and handled?

6. **Testing boundaries** - What gets mocked vs integrated?

Analyze import statements, package structure, and code organization to find these patterns.

Return 3-5 suggested tenets in this format:

### T1. <Short Name>

<Description: 2-4 sentences explaining the architectural constraint, why it matters, and examples if helpful>

**Evidence:**
- `<file:line>` - <what was observed>
- `<file:line>` - <what was observed>

Examples of good tenets:
- "Domain layer must not import infrastructure packages"
- "Database access must go through repository interfaces"
- "HTTP handlers must not contain business logic"
- "All external service calls must go through dedicated client packages"

Guidelines:
- Focus on ARCHITECTURE, not tooling
- Tenets should be actionable constraints: "X must/must not Y"
- Only suggest tenets with actual codebase evidence
- Include rationale (why this matters)
- Be specific about which components/layers are involved
```

Wait for the agent to return findings.

## Review

Present discovered tenets:

```markdown
## Suggested Tenets

Based on codebase analysis:

### T1. <Name>

<Description with rationale>

**Evidence:** <what was found>

### T2. <Name>

<Description with rationale>

**Evidence:** <what was found>

---

For each tenet, would you like to:
- **Accept** - Add as-is
- **Edit** - Modify before adding
- **Remove** - Don't include
- **Add custom** - Add your own tenet
```

Wait for user decisions on each tenet.

## Generate

Create or update AGENTS.md:

**If AGENTS.md doesn't exist:**

Create new file with only Tenets section:

```markdown
## Tenets

CRITICAL: These tenets are MANDATORY and MUST be followed in all work on this codebase.

### T1. <Name>

<Description>

### T2. <Name>

<Description>
```

**If AGENTS.md exists without Tenets:**

Insert Tenets section after first heading/paragraph, before other sections.

**If replacing existing Tenets:**

Replace the entire Tenets section (from `## Tenets` to next `## ` heading).

Show the changes:

```bash
git diff AGENTS.md
```

## Summary

```markdown
## Setup Complete

**Tenets created:**
- T1. <Name>
- T2. <Name>
- T3. <Name>

**AGENTS.md:** <Created / Updated>

### Next Steps
- Review the tenets in AGENTS.md
- Use `/governor:manage` to add, edit, or remove tenets
```

## Guidelines

1. **Evidence-based** - Only suggest tenets with codebase evidence
2. **Actionable** - Tenets should be "do X" not "X exists"
3. **Concise but complete** - Include rationale, not just rules
4. **User decides** - Present suggestions, let user choose
5. **Preserve content** - When updating, only modify Tenets section
