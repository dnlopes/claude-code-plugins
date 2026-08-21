---
description: Wire this plugin's statusline script into Claude Code settings.json
allowed-tools: Bash, Read, AskUserQuestion
---

# Set Up Status Line

Claude Code has no plugin-manifest field for registering a `statusLine` — it is a single
top-level `statusLine.command` entry in `settings.json`, and `${CLAUDE_PLUGIN_ROOT}` is not
guaranteed to be set when that command runs (unlike hook commands declared in `hooks.json`).
So this command must resolve the script's real installed path and write that absolute path
into `settings.json`, not rely on the env var at runtime.

## Step 1: Locate the installed script

```bash
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "$CLAUDE_PLUGIN_ROOT/scripts/statusline.py" ]; then
  SCRIPT_PATH="$CLAUDE_PLUGIN_ROOT/scripts/statusline.py"
else
  SCRIPT_PATH=$(ls -d "$HOME"/.claude/plugins/cache/*/status-line/*/scripts/statusline.py 2>/dev/null | sort -V | tail -1)
fi
echo "$SCRIPT_PATH"
```

If `$SCRIPT_PATH` is empty or does not point at an existing, executable file, stop and tell the
user the plugin doesn't appear to be installed via the marketplace — ask where it lives instead
of guessing.

## Step 2: Ask scope

Use AskUserQuestion to ask whether to wire this into the **global** settings
(`~/.claude/settings.json`, applies to every project) or the **project** settings
(`.claude/settings.json` in the current repo, applies only here).

## Step 3: Read existing settings

Read the target `settings.json` (it may not exist yet — treat a missing file as `{}`). If it
already has a `statusLine` entry, show the user the existing value and confirm before
overwriting it — do not clobber a status line they've already customized without asking.

## Step 4: Write the merged settings

Merge in:

```json
"statusLine": {
  "type": "command",
  "command": "<the resolved absolute SCRIPT_PATH>"
}
```

Preserve every other existing key in the file untouched. Write the file back with the same
formatting conventions (2-space indent, trailing newline) and report the final path plus a
one-line reminder that the change takes effect on the next status line refresh (no restart
needed).
