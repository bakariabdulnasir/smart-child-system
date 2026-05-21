# TODO Fix: Profile Picture and Task Issues

## Issue 1: Profile Picture Not Working
- [x] Analyzed AuthContext.js - Missing profile_image in state
- [x] Analyzed Settings.js - Doesn't update AuthContext after profile update
- [ ] Fix AuthContext.js - Add profile_image to user state
- [ ] Fix Settings.js - Update AuthContext after profile change

## Issue 2: Task Adding "Everything Becomes Zero"
- [x] Analyzed Tasks.js - child_id starts as empty string ''
- [x] Analyzed task_schema.py - Need better validation
- [ ] Fix Tasks.js - Add validation for child_id before submit
- [ ] Fix task_schema.py - Add validator to reject invalid child_id
- [ ] Test both fixes

## Implementation Steps:
1. Update AuthContext.js to include profile_image in user state
2. Update Settings.js to call updateAuthContext after profile update
3. Update Tasks.js to validate child_id before submission
4. Update task_schema.py to add proper validation for child_id
