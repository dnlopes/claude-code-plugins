---
name: comment-discipline
description: Governs when to add comments while writing or editing code, in any language, including IaC/config/manifest files. Comments exist only to capture genuinely hidden, codebase-specific facts — a silent failure mode, a cross-file/cross-system link nothing else surfaces, a workaround for a named external bug, an incident that already happened. Never to explain general engineering knowledge a competent practitioner already has, never to restate what a well-named identifier/resource/key already says (even in different words), never to narrate the current task, and never as a systematic habit applied to every function, block, or resource. Load before writing new code, editing existing code, or reviewing a diff for comment quality.
user-invocable: false
---

# Comment discipline

Default to writing no comments. A file that reads clean start-to-finish is the expected common case, not a gap to fill in. Add a comment only when both of the following are true:

1. The fact is genuinely hidden — not recoverable from good names, the surrounding code, or general knowledge of the language/tool/platform being used.
2. Missing it would cause a competent practitioner to get something concretely *wrong* (break it, "fix" it into a regression, waste real time chasing an external fact) — not just make them pause for a second to understand it.

If either condition fails, don't write it.

## The test

Before adding a comment, ask, in order:

1. **Would a competent, experienced practitioner in this domain already know this?** (General patterns, standard practice, what a language/framework/tool is known to do.) If yes → cut it, no matter how nicely it's phrased. "Competent" is the calibration — not a novice, not someone new to this specific tool.
2. **Does a well-named identifier, resource, or key already say this, even if the comment uses different words?** If the comment is a prose paraphrase of the name/value right below it → cut it. Elaboration is not exemption: dressing up a restatement in a full sentence, or adding one true-but-generic clause, does not make it load-bearing.
3. **Is this said somewhere else already** — a sibling file, a canonical doc, a shared convention this repo already establishes? If a reader who has seen that file once would find this a rerun → cut it here; keep it in the one place it belongs.
4. **If I deleted this, could the fact ever come back to bite someone** — silently (a mount fails, a policy blocks a rollout, a router doesn't fail over, two systems fight over the same resource) — **and is that fact NOT visible anywhere in this file?** Only this case clears the bar.

Do not stop at "this adds useful context" or "a reader might appreciate knowing this." Nearly anything clears that bar. The bar is *silent, concrete consequence*, not *helpful color*.

## What a comment is for

Only these, and only when they are not already common knowledge for someone competent in the relevant domain:

- A hidden constraint the code must satisfy but doesn't display (e.g. "must run before X due to ordering in the upstream API").
- A subtle invariant that isn't visible from the types, names, or resource spec.
- A workaround for a specific external bug, platform quirk, or tool version gap — ideally with a reference (ticket, issue link, upstream bug ID, exact version numbers).
- A specific incident or measured failure that already happened, and would happen again if "fixed" back ("this bit us"; "observed 23 OOM restarts"; "generated 23TB of reads and wedged the node"). Cite what actually happened, not a hypothetical.
- Behavior that looks wrong or redundant but is intentional, and would likely get "fixed" into a regression otherwise — where the *reason it looks wrong* is specific to this system, not inferable from domain convention.
- A cross-file or cross-system link that nothing else in the file surfaces (which role/job/service actually consumes this value; where it's enforced; where the counterpart lives) — stated once, at the one place a reader would land first, not copied into every file that touches it.

## What a comment is never for

- **Restating the code**, including a well-named key, resource, or variable — even paraphrased, even elaborated into a full sentence. A well-named identifier already says what it does; dressing that up in prose is still noise.
  ```python
  # increment the counter
  counter += 1
  ```
  ```yaml
  # Base domain for the cluster
  DOMAIN: "example.com"
  ```
- **Explaining general engineering or platform knowledge.** If a competent engineer working in this stack already knows it — pin your dependency versions, replicas give you failover, a separate Terraform state limits blast radius, NetworkPolicies default-deny plus explicit allow, ZFS mirrors survive one disk failure — it does not belong in this codebase's comments. This is the single most common failure mode: a true, well-written sentence that teaches the reader something they already knew.
  ```hcl
  # Pin deliberately; check the registry for new releases before bumping.
  image_tag = "v3.2.4"
  ```
  ```yaml
  # 2 replicas gives failover if one pod goes down.
  replicas: 2
  ```
- **Narrating the current task.** Comments must not reference the fix, the ticket, the caller, or the conversation that produced the change ("added for the new onboarding flow", "per user request", "fix for bug #123"). That context belongs in the commit message or PR description, not the file — it rots the moment the surrounding code changes again.
- **Recording a decision instead of a constraint.** "We chose Redis here" is a decision; it's not load-bearing information for the next reader unless *not knowing it* would cause them to break something. If the decision has a consequence the code doesn't show, comment the consequence, not the decision. A decision-record essay ("here is why this VM is standalone and not a cluster workload, and here is the industry principle behind that") belongs in `docs/` or a commit message, not stacked above the resource.
- **Duplicating the same explanation across sibling files or resources.** If the same rationale is copy-pasted above every namespace, every NetworkPolicy, every environment's version of the same module, it has become habitual coverage wearing the costume of a real comment. State it once, where a reader naturally lands first (the shared module, the canonical doc); every other instance gets nothing or, at most, a one-clause pointer.
- **Habitual coverage.** Every function, every block, every resource in a list does not need a comment. A config file that is mostly comments — one line of data, three lines of explanation, repeated down the whole file — has already failed this skill, no matter how individually reasonable each comment looks. Judge the file's comment-to-code ratio, not just each comment in isolation.
- **Multi-line docstring blocks** for something a one-line signature and a good name already explain.

## Examples

Bad — restates the code:
```javascript
// loop through users and check if active
for (const user of users) {
  if (user.active) { ... }
}
```

Bad — restates a well-named key, elaborated:
```yaml
# Let's Encrypt account email
ACME_EMAIL: "ops@example.com"
```

Bad — teaches general knowledge the reader already has:
```hcl
# Separate Terraform root gives this its own state file, so a cluster
# apply/destroy can never touch it and vice versa.
module "storage" { ... }
```

Bad — narrates the task instead of the code:
```javascript
// Changed to Set for O(1) lookup as requested in review
const seen = new Set();
```

Good — captures a non-obvious constraint:
```javascript
// API returns results unordered above 100 rows; re-sort client-side
const sorted = results.sort(byCreatedAt);
```

Good — flags a deliberate-looking oddity that would otherwise get "cleaned up":
```python
# retry count starts at 1, not 0 — upstream treats 0 as "infinite retries"
retry_count = 1
```

Good — cites a real incident, not a hypothetical:
```hcl
# writeback: a crash-looping pod under cache=none generated 23TB of real
# disk reads and wedged the node (k8s-prod-wrk-2 incident).
cache = "writeback"
```

Good — a hidden cross-system link nothing else in the file shows:
```yaml
# MUST be the IP, not the hostname: the CSI controller mounts from inside a
# pod via cluster DNS, which never sees the nodes' /etc/hosts entry.
NFS_SERVER: "10.0.0.5"
```

## Applying this during review

When reviewing a diff or an existing file for comment quality, flag:
1. Comments that just restate the adjacent line, key, or resource — including ones elaborated into full, well-written sentences.
2. Comments that explain something a competent practitioner in this domain already knows, with no fact specific to this codebase attached.
3. Comments referencing "this PR", "the fix", "as discussed", ticket numbers, or the user's request.
4. The same rationale copy-pasted across multiple sibling files, namespaces, or resources.
5. A file whose comment volume is disproportionate to its code — annotate-every-line style — even if no single comment is individually egregious.
6. Comments present on every function/block/resource regardless of whether any of them carry non-obvious information.
7. Missing comments only where a real hidden constraint, incident, or cross-system link exists and nothing else in the file surfaces it.

No exceptions for "just to be safe," "future readers might appreciate it," or "it's good documentation" — those are the systematic-commenting instinct this skill exists to override. When genuinely unsure whether a comment clears the bar, cut it: an under-commented file that occasionally sends a reader to git blame is a smaller cost than a codebase where every comment has to be individually evaluated for whether it's worth reading.
