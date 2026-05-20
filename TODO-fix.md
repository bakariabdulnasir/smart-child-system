# TODO - Fix Implementation

## Task 1: Add Nairobi Mock Data for Amenities
- Modify `app/services/location_service.py` to add fallback mock data for Nairobi
- When Overpass API returns empty, return creative mock schools, hospitals, parks etc.

## Task 2: Ensure Children Persist for Tasks
- Check the children creation flow to ensure children are properly saved
- Verify task creation works with child_id

## Implementation Steps:
1. Edit location_service.py - add mock Nairobi data
2. Test the changes
