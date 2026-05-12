#!/usr/bin/env python3
"""
PostToolUse hook for curator.

Reminds the model to update tracked documentation when files in a doc's
scope.paths are edited. Reminders are deduplicated per session.
Respects per-project opt-out in .claude/settings.json.

Environment variables (see module docstring for details):
  CLAUDE_CONFIG_DIR, PLUGIN_CURATOR_HOOK_AUTO_UPDATE_DOCUMENTATION
"""

import json
import os
import re
import sys
from pathlib import Path

CONFIG_DIR = Path(os.environ.get("CLAUDE_CONFIG_DIR", Path.home() / ".claude"))
STATE_DIR = CONFIG_DIR / "curator-hook-state"


def glob_to_regex(pattern: str) -> str:
    """Convert a glob pattern with ** to a regex."""
    escaped = re.escape(pattern)
    escaped = escaped.replace(r"\*\*", "###GLOBSTAR###")
    escaped = escaped.replace(r"\*", "[^/]*")
    escaped = escaped.replace(r"\?", "[^/]")
    escaped = escaped.replace("###GLOBSTAR###", ".*")
    return f"^{escaped}$"


def path_matches(file_path: str, pattern: str) -> bool:
    """Check if file_path matches a glob pattern."""
    return bool(re.match(glob_to_regex(pattern), file_path))


def extract_scope_paths(doc_content: str):
    """Extract scope.paths from HTML-wrapped YAML frontmatter."""
    m = re.search(r"<!--\s*(.*?)\s*-->", doc_content, re.DOTALL)
    if not m:
        return []

    yaml_block = m.group(1)
    lines = yaml_block.splitlines()
    in_paths = False
    base_indent = None
    paths = []

    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.lstrip()
        if stripped.startswith("paths:"):
            in_paths = True
            base_indent = len(line) - len(stripped) + 2
            continue
        if not in_paths:
            continue
        if stripped.startswith("- "):
            paths.append(stripped[2:].strip().strip('"').strip("'"))
        elif stripped and not stripped.startswith("#"):
            current_indent = len(line) - len(stripped)
            if current_indent <= base_indent - 2:
                break
    return paths


def find_tracked_docs():
    """Run the plugin's find-tracked-docs.sh script."""
    plugin_root = os.environ.get("CLAUDE_PLUGIN_ROOT", ".")
    script = Path(plugin_root) / "scripts" / "find-tracked-docs.sh"
    proj_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")

    import subprocess

    result = subprocess.run(
        ["bash", str(script)],
        capture_output=True,
        text=True,
        cwd=proj_dir,
    )
    return [p.strip() for p in result.stdout.splitlines() if p.strip()]


def is_opted_out():
    """Check per-project opt-out in .claude/settings.json."""
    for name in ("settings.json", "settings.local.json"):
        path = Path(".claude") / name
        if not path.exists():
            continue
        try:
            data = json.loads(path.read_text())
            if data.get("curator", {}).get("stalenessReminder") is False:
                return True
        except Exception:
            pass
    return False


def main():
    hook_input = json.load(sys.stdin)
    session_id = hook_input.get("session_id", "unknown")
    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})

    edited_paths = []
    if tool_name == "MultiEdit":
        edited_paths = tool_input.get("filePaths", [])
    else:
        fp = tool_input.get("file_path", "")
        if fp:
            edited_paths = [fp]

    if not edited_paths:
        return

    if is_opted_out():
        return

    tracked_docs = find_tracked_docs()
    if not tracked_docs:
        return

    STATE_DIR.mkdir(parents=True, exist_ok=True)
    state_file = STATE_DIR / f"{session_id}.reminded"
    reminded = set()
    if state_file.exists():
        reminded = set(state_file.read_text().splitlines())

    proj_dir = Path(os.environ.get("CLAUDE_PROJECT_DIR", ".")).resolve()
    new_reminders = []

    for doc_path in tracked_docs:
        abs_doc = Path(doc_path).resolve()
        if not abs_doc.exists():
            continue
        content = abs_doc.read_text()
        scope_paths = extract_scope_paths(content)
        if not scope_paths:
            continue

        matched = False
        for edited in edited_paths:
            edited_rel = edited
            if edited_rel.startswith("/"):
                try:
                    edited_rel = str(Path(edited_rel).relative_to(proj_dir))
                except ValueError:
                    pass
            for pattern in scope_paths:
                if path_matches(edited_rel, pattern):
                    matched = True
                    break
            if matched:
                break

        if matched and doc_path not in reminded:
            reminded.add(doc_path)
            new_reminders.append(doc_path)

    if new_reminders:
        state_file.write_text("\n".join(reminded) + "\n")
        docs_str = ", ".join(f"`{d}`" for d in new_reminders)
        auto_update = os.environ.get("PLUGIN_CURATOR_HOOK_AUTO_UPDATE_DOCUMENTATION", "").lower() in ("1", "true")
        if auto_update:
            print(
                f"📚 Edited files are covered by tracked doc(s) {docs_str}. "
                f"You should update these documentation files directly to reflect the recent code changes."
            )
        else:
            print(
                f"📚 Edited files are covered by tracked doc(s) {docs_str}. "
                f"Consider running `/curator:updating-documentation` to refresh."
            )


if __name__ == "__main__":
    main()
