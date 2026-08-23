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

Each skill-bearing Claude Code plugin is also an **isolated OpenCode plugin**. The adapter registers that plugin’s `skills/`, and when present `agents/` and `commands/`. There is **no bootstrap injection** — the model loads skills when descriptions match; commands are user-invoked (`/name`).

Claude hooks and `status-line` stay Claude-only.

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
    "~/src/claude-code-plugins/review-toolkit"
  ]
}
```

Paths may be absolute or `~`-prefixed. Relative paths are resolved from the config file’s directory.

**Restart OpenCode** after changing config.

### Available packages

| Directory | Package | Skills | Agents | Commands |
|-----------|---------|:------:|:------:|:--------:|
| `backend-dev/` | `@dnlopes/backend-dev` | yes | — | — |
| `curator/` | `@dnlopes/curator` | yes | yes | — |
| `git-workflow/` | `@dnlopes/git-workflow` | yes | — | `commit`, `create-pr` |
| `governor/` | `@dnlopes/governor` | yes | yes | — |
| `quartermaster/` | `@dnlopes/quartermaster` | yes | — | — |
| `review-toolkit/` | `@dnlopes/review-toolkit` | yes | yes | `review-pr` |
| `ui-dev/` | `@dnlopes/ui-dev` | yes | — | — |
| `voice/` | `@dnlopes/voice` | yes | — | — |

`status-line` is not packaged for OpenCode.

### Updating

```bash
cd ~/src/claude-code-plugins && git pull
```

Restart OpenCode.

## What gets registered

The adapter (`.opencode/plugin.js`) on `config`:

1. **Skills** — pushes `<plugin>/skills` onto `config.skills.paths` (same `SKILL.md` trees as Claude).
2. **Agents** — reads `<plugin>/agents/*.md`, sets `mode: subagent`, maps body → `prompt`, keeps `description` / theme `color`. Registers each agent under:
   - bare name (`tenet-verifier`) — OpenCode-native
   - `plugin:name` (`governor:tenet-verifier`) — matches Claude-style skill refs
   Bare Claude model aliases (`sonnet`) are dropped; only `provider/model` is kept.
3. **Commands** — reads `<plugin>/commands/*.md`, maps body → `template`, keeps `description`. Claude-only frontmatter (`allowed-tools`, `argument-hint`) is ignored.

No message transforms. No forced skill loading.

## Verify

1. Restart OpenCode with a plugin path in `plugin`.
2. **Skills:** use the `skill` tool to list/load (e.g. `committing-work`, `governor-verify`).
3. **Commands:** run `/commit`, `/create-pr`, or `/review-pr` when those plugins are installed.
4. **Agents:** invoke via Task/`task` with `subagent_type` equal to the bare name or `plugin:name` alias (e.g. `tenet-verifier` or `governor:tenet-verifier`).

## Layout

```
<plugin>/
├── package.json              # @dnlopes/<plugin>, main → .opencode/plugin.js
├── .opencode/plugin.js       # registers skills + agents + commands
├── skills/                   # shared with Claude Code
├── agents/                   # optional; registered as OpenCode subagents
├── commands/                 # optional; registered as OpenCode /commands
└── .claude-plugin/           # Claude marketplace (unchanged)
```

## Authoring rules

- Skill-bearing plugins must keep `.opencode/plugin.js` and `package.json` in lockstep with Claude versioning: bump `package.json` with the dual Claude manifests (T2). Include `agents` / `commands` in `package.json` `files` when those dirs exist.
- Prefer harness-neutral skill prose. Where Claude uses `plugin:name` agent ids, note the OpenCode bare name (or rely on the adapter’s dual registration).
- Do not add bootstrap / `messages.transform` unless product requirements change.
- Plugins without `skills/` do not get an OpenCode package.

## Out of scope

- Claude hooks (curator staleness, voice comment suggestions)
- `status-line`
- Forced skill loading / bootstrap
- npm publish of `@dnlopes/*` (local path is the supported channel)
- MCP entries from `ui-dev/.mcp.json` (configure OpenCode `mcp` separately if needed)
