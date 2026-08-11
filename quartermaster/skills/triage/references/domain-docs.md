# Domain Docs

How to consume this repo's domain documentation while triaging issues or drafting tickets.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`docs/adr/`** — read ADRs that touch the area you're about to work in. In multi-context repos, also check `<context>/docs/adr/` for context-scoped decisions.

If any of these files don't exist, proceed silently — don't flag their absence or suggest creating them upfront.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo:

```
/
├── docs/adr/       ← system-wide decisions
└── <context 1>/
    ├── CONTEXT.md
    ├── docs/adr/   ← context-specific decisions
└── <context 1>/
    ├── CONTEXT.md
    └── docs/adr/   ← context-specific decisions
```

## Flag ADR conflicts

If a proposed outcome contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
