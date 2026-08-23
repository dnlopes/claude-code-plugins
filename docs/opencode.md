<!--
---
scope:
  paths:
    - "*/.opencode/**"
    - "*/package.json"
    - docs/opencode.md
  summary: "OpenCode install and packaging for marketplace plugins"
last_updated: 2026-08-23T00:00:00Z
---
-->

# OpenCode

Each skill-bearing Claude Code plugin is also an **isolated OpenCode plugin**. The adapter registers that plugin’s skills, agents, commands, optional MCP servers, and a thin port of Claude hooks where they exist. There is **no Superpowers-style skill bootstrap** that forces skill loading on every turn.

`status-line` is Claude UI-only and is not packaged for OpenCode.

## Install (supported)

OpenCode resolves plugins with Bun. Bun does not reliably install a **subdirectory** of a git repo as a package, so plugins are installed from a **local path** after cloning this repository once.

```bash
git clone https://github.com/dnlopes/claude-code-plugins.git ~/src/claude-code-plugins
```

Add only the plugins you want in global `~/.config/opencode/opencode.json` or project `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "~/src/claude-code-plugins/git-workflow",
    "~/src/claude-code-plugins/governor",
    "~/src/claude-code-plugins/review-toolkit",
    "~/src/claude-code-plugins/ui-dev",
    "~/src/claude-code-plugins/curator",
    "~/src/claude-code-plugins/voice"
  ]
}
```

Paths may be absolute or `~`-prefixed. Relative paths are resolved from the config file’s directory.

**Restart OpenCode** after changing config.

### Available packages

| Directory | Package | Skills | Agents | Commands | MCP | Hooks |
|-----------|---------|:------:|:------:|:--------:|:---:|:-----:|
| `backend-dev/` | `@dnlopes/backend-dev` | yes | — | — | — | env |
| `curator/` | `@dnlopes/curator` | yes | yes | — | — | env + staleness |
| `git-workflow/` | `@dnlopes/git-workflow` | yes | — | `commit`, `create-pr` | — | env |
| `governor/` | `@dnlopes/governor` | yes | yes | — | — | env |
| `quartermaster/` | `@dnlopes/quartermaster` | yes | — | — | — | env |
| `review-toolkit/` | `@dnlopes/review-toolkit` | yes | yes | `review-pr` | — | env |
| `ui-dev/` | `@dnlopes/ui-dev` | yes | — | — | shadcn | env |
| `voice/` | `@dnlopes/voice` | yes | — | — | — | env + session hint |

### Updating

```bash
cd ~/src/claude-code-plugins && git pull
```

Restart OpenCode.

## What gets registered

The adapter (`.opencode/plugin.js`) on load:

1. **Skills** — pushes `<plugin>/skills` onto `config.skills.paths`.
2. **Agents** — maps `agents/*.md` → `config.agent` (`mode: subagent`, body → `prompt`). Registers bare name and `plugin:name` alias. Expands `${CLAUDE_PLUGIN_ROOT}` in prompts to the plugin directory.
3. **Commands** — maps `commands/*.md` → `config.command` (body → `template`). Claude-only frontmatter is ignored.
4. **MCP** — if `.mcp.json` exists, maps servers into `config.mcp` (`http`/`sse` → OpenCode `remote`).
5. **shell.env** — sets `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PROJECT_DIR`, `OPENCODE_PLUGIN_ROOT`, `OPENCODE_PLUGIN_NAME` so skills/scripts that use the Claude env var work under OpenCode bash.
6. **Hooks (optional)**
   - **voice:** one-time session hint via `experimental.chat.messages.transform` (comment-discipline reminder only — not a skill-catalog bootstrap).
   - **curator:** after edit/write tools, runs `hooks/staleness-reminder.py` and appends its stdout to tool output when present.

## Verify

1. Restart OpenCode with plugin paths configured.
2. **Skills:** `skill` tool → load e.g. `committing-work`, `governor-verify`.
3. **Commands:** `/commit`, `/create-pr`, `/review-pr`.
4. **Agents:** Task/`task` with `subagent_type` `tenet-verifier` or `governor:tenet-verifier`.
5. **MCP (ui-dev):** confirm `shadcn` appears among MCP servers.
6. **voice:** first user turn should include a short comment-discipline hint once.
7. **curator:** edit a file under a tracked doc’s `scope.paths` and check for a staleness reminder in tool output.

## Layout

```
<plugin>/
├── package.json              # @dnlopes/<plugin>, main → .opencode/plugin.js
├── .opencode/plugin.js       # adapter
├── skills/                   # shared with Claude Code
├── agents/                   # optional
├── commands/                 # optional
├── hooks/                    # optional; OpenCode ports when present
├── scripts/                  # optional; available via CLAUDE_PLUGIN_ROOT
├── .mcp.json                 # optional; mapped to OpenCode mcp
└── .claude-plugin/           # Claude marketplace (unchanged)
```

## Authoring rules

- Skill-bearing plugins must keep `.opencode/plugin.js` and `package.json` in lockstep with Claude versioning (T2). Include `agents`, `commands`, `hooks`, `scripts`, `.mcp.json` in `package.json` `files` when those exist.
- Prefer harness-neutral skill prose. Claude `plugin:name` agent ids remain valid; the adapter also registers bare names.
- Use `${CLAUDE_PLUGIN_ROOT}` for plugin-local scripts/templates — both harnesses set it (OpenCode via `shell.env`).
- Do not add Superpowers-style forced skill bootstrap.
- Plugins without skills (e.g. `status-line`) do not get an OpenCode package.

## Out of scope

- `status-line` (Claude Code status bar UI; OpenCode has no equivalent)
- npm publish of `@dnlopes/*` (local path is the supported channel)
- Perfect parity of every Claude hook edge case (opt-out keys, MultiEdit shapes may differ)
