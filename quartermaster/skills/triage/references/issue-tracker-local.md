# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

There is no local-file equivalent of "external PRs as a triage surface" — this tracker has no PR/MR concept.

## When to-tickets or triage says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When to-tickets or triage says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.
