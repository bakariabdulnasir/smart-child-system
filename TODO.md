# TODO - Fix Amenities and Tasks Issues

## Steps to Complete:

- [ ] 1. Add fallback location data service with pre-populated Nairobi schools and amenities
- [ ] 2. Update location_controller.py to use fallback data when Overpass API returns empty
- [ ] 3. Update Tasks.js to use ChildrenContext with proper state management
- [ ] 4. Test the fixes

## Implementation Details:

### Issue 1: Amenities Not Returning Schools
- Add fallback_nairobi_locations.py with pre-populated schools, hospitals, parks in Nairobi
- Update location_service.py to use fallback data when API returns empty results

### Issue 2: Children Disappearing When Adding Tasks  
- Update Tasks.js to use ChildrenContext properly
- Ensure children are re-fetched on component mount
- Add proper loading and error states
