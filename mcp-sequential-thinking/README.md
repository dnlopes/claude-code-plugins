# mcp-sequential-thinking

Structured problem-solving through step-by-step reasoning via Sequential Thinking MCP server.

## Purpose

Enables systematic decomposition of complex problems into manageable steps with support for revising conclusions, branching into alternative approaches, and maintaining extended reasoning context.

## Features

### MCP Tools

- **sequential_thinking** - Orchestrates detailed, step-by-step analytical processes

### Capabilities

- Break down complex problems into manageable steps
- Revise earlier conclusions as understanding deepens
- Branch into multiple reasoning paths to explore alternatives
- Dynamically adjust the number of thinking steps needed
- Filter irrelevant information while maintaining context

### Skill

- **sequential-thinking** - Guidance on when and how to use sequential thinking effectively

## Installation

```bash
claude-code plugins install /path/to/cloud-code-plugins/mcp-sequential-thinking
```

## When to Use

Sequential thinking is valuable for:

- Problems with unclear scope or multiple valid approaches
- Analysis requiring course correction as understanding deepens
- Multi-step debugging where root cause isn't obvious
- Design decisions with tradeoffs to evaluate
- Tasks needing extended context maintenance

## Quick Example

```bash
# The sequential_thinking tool is automatically available after installation

# Claude will use it for complex reasoning tasks:
# "Debug why authentication fails intermittently"
# "Analyze the tradeoffs between these three approaches"
# "Help me work through this architectural decision"
```

## How It Works

1. Start a reasoning chain with an initial thought and step estimate
2. Continue through each step, building on previous conclusions
3. Revise earlier steps if new information contradicts them
4. Branch to explore alternative approaches when useful
5. Conclude with a clear decision or recommendation

The skill provides detailed guidance on using these features effectively.
