# Triage Labels

`triage` and `to-tickets` speak in terms of canonical role names. This file is the single source of truth mapping those roles to the actual label strings used in this repo's issue tracker — edit the right-hand column to match whatever vocabulary this repo actually uses.

## Category roles (triage only)

| Canonical name | Label in our tracker | Meaning                        |
| --------------- | --------------------- | ------------------------------- |
| `bug`            | `bug`                  | Something is broken             |
| `enhancement`    | `enhancement`          | New feature or improvement      |

## State roles

| Canonical name     | Label in our tracker | Meaning                                  | Used by                |
| ------------------- | --------------------- | ----------------------------------------- | ----------------------- |
| `needs-triage`      | `needs-triage`         | Maintainer needs to evaluate this issue   | `triage`                 |
| `needs-info`        | `needs-info`           | Waiting on reporter for more information  | `triage`                 |
| `ready-for-agent`   | `ready-for-agent`      | Fully specified, ready for an AFK agent   | `triage`, `to-tickets`   |
| `ready-for-human`   | `ready-for-human`      | Requires human implementation             | `triage`                 |
| `wontfix`           | `wontfix`              | Will not be actioned                      | `triage`                 |

When a skill mentions a role by name (e.g. "apply the `ready-for-agent` label"), use the corresponding string from the right-hand column, not the canonical name literally.
