---
name: code-quality-standards
description: Use this skill when writing, reviewing, or refactoring code. It provides standards for code quality, naming conventions, and code comments that prioritize readability, maintainability, and clarity over cleverness.
---

# Code Quality Standards

Standards for writing clean, maintainable code with clear naming and useful comments.

## Writing Code

### Core Principles

- Make the SMALLEST reasonable changes to achieve the desired outcome
- Prefer simple, clean, maintainable solutions over clever or complex ones
- Readability and maintainability are PRIMARY CONCERNS, even at the cost of conciseness or performance
- Work hard to reduce code duplication, even if refactoring takes extra effort
- Match the style and formatting of surrounding code - consistency within a file trumps external standards
- Do not manually change whitespace that does not affect execution or output - use formatting tools instead
- Fix broken things immediately when you find them

### What to Avoid

- Never throw away or rewrite implementations without explicit permission
- Never implement backward compatibility without explicit approval
- Never over-engineer - add only what is directly requested or clearly necessary

## Naming Conventions

### Core Rules

- Names MUST tell what code does, not how it's implemented or its history
- When changing code, never document the old behavior or the behavior change in names
- NEVER use implementation details in names (e.g., "ZodValidator", "MCPWrapper", "JSONParser")
- NEVER use temporal/historical context in names (e.g., "NewAPI", "LegacyHandler", "UnifiedTool", "ImprovedInterface", "EnhancedParser")
- NEVER use pattern names unless they add clarity (e.g., prefer "Tool" over "ToolFactory")

### Examples

Good names tell a story about the domain:

| Good | Bad |
|------|-----|
| `Tool` | `AbstractToolInterface` |
| `RemoteTool` | `MCPToolWrapper` |
| `Registry` | `ToolRegistryManager` |
| `execute()` | `executeToolWithValidation()` |

### Self-Check

If you catch yourself writing "new", "old", "legacy", "wrapper", "unified", or implementation details in names, STOP and find a better name that describes the thing's actual purpose.

## Code Comments

### What Comments Should Do

- Explain WHAT the code does or WHY it exists
- All code files MUST start with a brief 2-line comment explaining what the file does
- Each line MUST start with "ABOUTME: " to make them easily greppable

### What Comments Should NOT Do

- NEVER add comments explaining that something is "improved", "better", "new", "enhanced", or referencing what it used to be
- NEVER add instructional comments telling developers what to do ("copy this pattern", "use this instead")
- NEVER add comments about what used to be there or how something has changed
- NEVER refer to temporal context in comments (like "recently refactored", "moved")

### Refactoring Rules

- If you're refactoring, remove old comments - don't add new ones explaining the refactoring
- NEVER remove code comments unless you can PROVE they are actively false - comments are important documentation

### Examples

```
// BAD: This uses Zod for validation instead of manual checking
// BAD: Refactored from the old validation system
// BAD: Wrapper around MCP tool protocol
// GOOD: Executes tools with validated arguments
```

Comments should be evergreen and describe the code as it is, not its history.
