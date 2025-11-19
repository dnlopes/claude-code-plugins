---
name: implement-plan
description: Implement approved technical plans phase by phase with automated and manual verification at each step
---

# Implement Plan

You are tasked with implementing an approved technical plan. These plans contain phases with specific changes and success criteria.

## Process

### Step 1: Context Gathering

1. **Read all relevant files**:
   - Read the plan completely
   - Read the original ticket (if any) and all files mentioned in the plan
   - **Read files fully** - never use limit/offset parameters, you need complete context

2. **Identify the current implementation status**:
   - Check for any existing checkmarks (- [x]) to assess which phases are already implemented (if any)
   - Identify the phase that needs to be implemented next

### Step 2: Implementation

1. **Think deeply to ensure that you have the needed context to successfully implement the next phase**
   
2. **Create a todo list to track your progress**

3. **Start implemeting**
   - Execute the changes identified on the plan document
   - ALWAYS implement unit tests
   - Tests are part of the implementation phase and must NEVER be postponed

### Step 3: Validation
1. **Verify your implementation**
   - Execute the success criteria automated checks
   - Fix any issues before proceeding
   - Verify your work makes sense in the broader codebase context
   - Update your progress in both the plan file and your todos

2. **Pause for manual validations**
   - Inform the human that the phase is ready for manual testing. Use this format:
    ```
    Phase [N] Complete - Ready for Manual Verification

    Automated verification passed:
    - [List automated checks that passed]

    Please perform the manual verification steps listed in the plan:
    - [List manual verification items from the plan]

    Let me know when manual testing is complete so I can proceed to Phase [N+1].
    ```
   - If instructed to execute multiple phases consecutively, skip the pause until the last phase. Otherwise, assume you are just doing one phase.
   - If no manual steps are required, proceed.
   - Do not check off items in the manual testing steps until confirmed by the user.

6. **Wrap up**
   - after a phase is fully implemented and tested, ensure the plan progress is updated before moving to the next phase
   - NEVER proceed to the next phase if automated checks are not validated, unless explicitely allowed by the user
   - NEVER proceed to the next phase if unit tests were not implemented, unless explicitely allowed by the user 
 
## Implementation Philosophy

Plans are carefully designed, but reality can be messy. Your job is to:
- Follow the plan's intent while adapting to what you find
- Implement each phase fully before moving to the next
- Update checkboxes in the plan as you complete sections/phases

When things don't match the plan exactly, think about why and communicate clearly. The plan is your guide, but your judgment matters too.

If you encounter a mismatch:
- STOP and think deeply about why the plan can't be followed
- Present the issue clearly:
  ```
  Issue in Phase [N]:
  Expected: [what the plan says]
  Found: [actual situation]
  Why this matters: [explanation]

  How should I proceed?
  ```

## If You Get Stuck

When something isn't working as expected:
- First, make sure you've read and understood all the relevant code
- Consider if the codebase has evolved since the plan was written
- Present the mismatch clearly and ask for guidance

Use sub-tasks sparingly - mainly for targeted debugging or exploring unfamiliar territory.
