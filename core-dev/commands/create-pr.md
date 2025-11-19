---
name: create-pr
description: Create a new branch, push to remote, and create a pull request on GitHub
---

You are helping create a GitHub pull request. Follow these steps:

**ASSUMPTIONS:**
- All changes are already committed locally
- The current branch is the one with the changes

**STEPS:**

1. **Analyze the commits:**
   - Run `git log origin/main..HEAD` (or appropriate base branch) to see all commits that will be included
   - Run `git diff origin/main...HEAD` to see the full diff

2. **Create a new branch:**
   - Generate a descriptive branch name based on the changes (use kebab-case, e.g., `feature/add-user-auth` or `fix/memory-leak`)
   - Create and checkout the new branch: `git checkout -b <branch-name>`

3. **Push to remote:**
   - Push the new branch to origin with tracking: `git push -u origin <branch-name>`

4. **Create the pull request:**
   - Analyze ALL commits (not just the latest) to understand the full scope of changes
   - Generate a clear, concise title (max 72 characters) that describes what the PR does
   - Create a PR body with:
     - Brief summary of changes (2-3 sentences)
     - Why these changes were made
     - Any relevant context or notes

**IMPORTANT:**
- DO NOT use the TodoWrite tool
- Be concise and focused
- Return the PR URL when done
- If $ARGUMENTS is provided, use it as context or as the target base branch
- Use the GH cli tool to interact with GitHub
