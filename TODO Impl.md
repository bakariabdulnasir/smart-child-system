# TODO - Implementation Plan

## Phase 1: Fix and Enhance Schedule Page
- [ ] Fix Schedule.js datetime handling
- [ ] Ensure proper datetime formatting for API requests

## Phase 2: Enhance Child Model and Schema
- [ ] Add new fields to Child model (school, medical_notes, allergies, emergency_contact, emergency_phone)
- [ ] Update ChildSchema with new fields
- [ ] Update child controller to handle new fields

## Phase 3: Create Children Page
- [ ] Create frontend/src/pages/Children.js with:
  - List view of all children
  - Click to view child details
  - Add/Edit/Delete children
  - Profile image upload capability

## Phase 4: Create Tasks Page
- [ ] Create frontend/src/pages/Tasks.js with:
  - Full CRUD operations
  - Task status management
  - Priority handling
  - Filter by status/priority

## Phase 5: Update App.js Routing
- [ ] Add routes for /children and /tasks pages

## Phase 6: Update Dashboard
- [ ] Make dashboard interactive with navigation to new pages
