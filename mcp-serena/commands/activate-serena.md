---
name: activate-serena
description: Activate Serena MCP semantic code analysis for the current or specified project
---

# Activate Serena for Project

You will help the user activate Serena's semantic code analysis for a project.

## What is Serena?

Serena is an MCP server that provides IDE-like semantic code analysis capabilities:
- Symbol-based code navigation (find classes, methods, functions)
- Code structure understanding (get file overviews, symbol hierarchies)
- Reference tracking (find all usages of a symbol)
- Pattern searching with code context
- Supports 20+ programming languages

## Activation Workflow

Follow these steps:

### Step 1: Determine Project to Activate

Ask the user which project they want to activate using the `AskUserQuestion` tool:

**Question**: "Which project would you like to activate Serena for?"

**Options**:
1. **Current directory** - Activate the project in your current working directory
2. **Specific path** - Provide an absolute or relative path to a project directory

### Step 2: Resolve the Path

Based on the user's choice:
- **Current directory**: Use the working directory from the environment context
- **Specific path**:
  - If relative path provided, resolve to absolute using `realpath` or similar
  - If absolute path provided, use as-is
  - Verify the path exists

### Step 3: Activate the Project

Call the Serena activation tool:
```
mcp__plugin_core-mcps_serena__activate_project(project: "<absolute_path>")
```

### Step 4: Confirm Success

Display a success message to the user:
```
✓ Serena activated for project: <project_path>

You can now use semantic code analysis tools:
- "Find all implementations of UserService"
- "Show me the structure of src/api/routes.ts"
- "Where is the processPayment function used?"
- "Find all classes that implement IRepository"
```

### Step 5: Check Onboarding

After activation, call the onboarding check tool to see if the project has been onboarded:
```
mcp__plugin_core-mcps_serena__check_onboarding_performed()
```

If onboarding hasn't been performed, inform the user that Serena may need a moment to index the codebase, and they can proceed with semantic queries.

## Error Handling

If activation fails:
- Check if the path exists and is a valid directory
- Verify the path contains code files
- Display the error message from Serena
- Ask if the user wants to try a different path

## Important Notes

- Serena indexes the project's code structure during activation
- This may take a few moments for large codebases
- Once activated, all semantic tools are available for that project
- The activation persists for the current Claude Code session