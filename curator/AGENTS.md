<!--
---
scope:
  paths:
    - curator/**
  summary: "curator plugin technical documentation"
last_updated: 2026-05-12T00:00:00Z
---
-->

# curator

The curator plugin exists to keep repository documentation current for AI agent consumers. It generates structured documentation from codebase exploration, tracks staleness using git history against declared scope paths, and updates or validates docs on demand. It is self-hosting: curator documents this very repository, so changes to its internals directly affect future documentation runs.

## Responsibilities & Boundaries

**Owns:** Documentation generation, staleness detection, documentation update orchestration, and documentation validation for any repository it is applied to.

**Does NOT own:** Code quality enforcement (that's `governor`), code review (that's `review-toolkit`), or git workflow automation (that's `git-workflow`). Curator's output is documentation files — it does not modify source code.

**Hands off to:** The operator, after producing or validating documentation. Curator produces files and reports; it does not push commits or open PRs on its own.

## Key Abstractions

### Staleness Detection
**Represents:** The determination of whether a documentation file is out-of-date relative to the code it describes.
**Lives in:** `curator/scripts/find-tracked-docs.sh`, with supporting logic in `curator/agents/doc-analyzer.md`
**Invariants:** Staleness is computed by comparing the `last_updated` field in a doc's HTML-wrapped frontmatter against `git log` for the file paths listed in that doc's `scope.paths`. A doc with no `scope.paths` is considered untracked and will not be offered for update. Docs without HTML-wrapped frontmatter are invisible to the staleness system.

### HTML-Wrapped Frontmatter
**Represents:** The metadata block that makes a documentation file trackable — it carries `last_updated` and `scope.paths` in a YAML block wrapped in an HTML comment so it is invisible in rendered markdown.
**Lives in:** Declared in `curator/skills/documenting-repositories/reference/frontmatter-spec.md`; all generated docs must use this format.
**Invariants:** The opening `<!--` must be the literal first line of the file. The `last_updated` field must be ISO 8601 UTC. Missing or malformed frontmatter silently breaks staleness tracking — there is no error; the file is simply skipped.

### codebase-explorer Agent
**Represents:** The first-pass analysis agent that maps a repository's architecture, patterns, invariants, and complex modules before documentation is generated.
**Lives in:** `curator/agents/codebase-explorer.md`
**Invariants:** Its output is structured findings consumed by the doc-generator agent. It must produce scope paths for each document type. The quality of generated documentation is bounded by the quality of exploration findings.

### doc-generator Agent
**Represents:** The agent that transforms codebase-explorer findings into properly formatted documentation files on disk.
**Lives in:** `curator/agents/doc-generator.md`
**Invariants:** Must read templates from `curator/skills/documenting-repositories/reference/templates.md` — never from memory. All output files must use HTML-wrapped frontmatter. Must not include line numbers, code snippets, or function/parameter listings in generated output.

### doc-analyzer Agent
**Represents:** The agent that examines an existing documentation file and recommends updates based on code changes detected since `last_updated`.
**Lives in:** `curator/agents/doc-analyzer.md`
**Invariants:** Operates on a single document at a time. Reads the doc's `scope.paths` to determine which code paths to analyze. Produces a recommendation (update / no-change / review-needed), not a rewritten file — the operator decides whether to apply changes.

## Gotchas

- **Self-hosting risk:** Modifying curator skills changes how documentation will be generated on future runs. A broken skill may silently produce malformed docs. Test changes to curator against a non-critical repository before merging.
- **Frontmatter is load-bearing:** The `last_updated` and `scope.paths` fields in HTML-wrapped frontmatter are not decorative. Removing or malforming them breaks staleness tracking without any error — the doc simply disappears from the tracked set.
- **Template source is canonical:** The doc-generator agent must read templates from `curator/skills/documenting-repositories/reference/templates.md`. Using remembered or reconstructed templates will produce docs that drift from the spec, breaking future validation.
- **Exploration quality bounds output quality:** The codebase-explorer agent's findings are the sole input to documentation generation. If the explorer misses a pattern or invariant, the generated doc will omit it silently. There is no post-generation validation that checks completeness.

## Interactions

- **codebase-explorer → doc-generator:** Structured findings (architecture, patterns, scope paths, module list) flow from explorer to generator. These agents are decoupled by a handoff in the skill workflow — they do not call each other directly.
- **doc-analyzer → operator:** The analyzer produces a human-readable recommendation. The operator (or an orchestrating skill) decides whether to instruct doc-generator to rewrite the document.
- **find-tracked-docs.sh → staleness workflow:** The script queries git and the filesystem to produce a list of tracked docs with their staleness status. Skills that update docs invoke this script to determine which docs need attention.
