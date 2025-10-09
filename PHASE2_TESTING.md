# 🧪 Phase 2 Testing Guide

## Quick Test Checklist

### ✅ Event Creation Flow

1. Open the app
2. Go to **Events** tab
3. Tap **"Create New Event"** button
4. Fill in the form:
   - Title: "Test Event"
   - Category: Select any
   - Date: Pick a future date
   - Time: Pick a time
   - Location: "Test Location"
   - Description: Add some text
5. Tap **"Create Event"**
6. ✅ Should see success alert
7. ✅ Can view event or create another

### ✅ Event Details Flow

1. Go to **Events** tab
2. Tap any event card
3. ✅ Should navigate to details screen
4. ✅ Should see all event information
5. ✅ Should see map with marker
6. Test the buttons:
   - Tap heart icon (should toggle save)
   - Tap "Get Directions" (should try to open maps)

### ✅ Calendar Integration

1. Open any event details
2. Tap **"Add to Calendar"**
3. ✅ Should request calendar permission (first time)
4. Grant permission
5. ✅ Should see success message
6. Open device calendar app
7. ✅ Event should appear in calendar
8. ✅ Reminder should be set (1 hour before)

### ✅ Share Functionality

1. Open any event details
2. Tap **"Share Event"**
3. ✅ Should show share options
4. Try different sharing methods
5. ✅ Share message should be formatted with event details

### ✅ Navigation

1. From **Home** tab:
   - Tap "Create Event" → Should open create screen
   - Tap "Browse Events" → Should go to Events tab
2. From **Events** tab:
   - Tap event card → Should open details
   - Tap create button → Should open create form
3. Back navigation:
   - ✅ Back button should work on all screens
   - ✅ iOS swipe back should work

## 📱 Platform-Specific Tests

### iOS

- ✅ Date picker shows spinner style
- ✅ Time picker shows spinner style
- ✅ Swipe back gestures work
- ✅ Calendar saves to iOS Calendar
- ✅ Native share sheet appears

### Android

- ✅ Date picker shows calendar style
- ✅ Time picker shows clock style
- ✅ Back button works
- ✅ Calendar saves to Google Calendar
- ✅ Native share sheet appears

### Web

- ✅ App loads and runs
- ✅ Navigation works
- ⚠️ Calendar may not work (browser limitation)
- ⚠️ Share may show alert instead of native share

## 🐛 Common Issues & Solutions

### Calendar Permission Denied

**Issue**: Calendar access denied
**Solution**: Go to device Settings → App → Permissions → Enable Calendar

### Share Not Working

**Issue**: Share button doesn't do anything
**Solution**: This is expected on web. Use mobile device for full functionality

### Map Not Showing Location

**Issue**: Map shows default location
**Solution**: This is expected (geocoding not implemented yet). Map is for demonstration

### Date Picker Not Appearing

**Issue**: Picker doesn't show on Android
**Solution**: Make sure you're using a physical device or recent emulator

## 🎯 Test Scenarios

### Scenario 1: Create and Share Event

1. Create a new event
2. View the created event
3. Add to calendar
4. Share with friends
5. ✅ All actions complete successfully

### Scenario 2: Browse and Save Events

1. Go to Events tab
2. Browse existing events
3. Open event details
4. Save to favorites (heart icon)
5. Add to calendar
6. ✅ Event saved and in calendar

### Scenario 3: Navigation Flow

1. Start at Home
2. Create event from Home
3. View created event
4. Go back to Home
5. Navigate to Events tab
6. Open another event
7. ✅ Navigation works smoothly

## ⚡ Performance Checks

- ✅ App loads quickly
- ✅ Scrolling is smooth
- ✅ Transitions are fluid
- ✅ No crashes or freezes
- ✅ Forms respond immediately

## 📊 Expected Results

After testing all features:

- ✅ Events can be created with all fields
- ✅ Events display correctly with all information
- ✅ Calendar integration works (on mobile)
- ✅ Share functionality works (on mobile)
- ✅ Navigation is smooth and intuitive
- ✅ UI is responsive and looks good
- ✅ No errors in console

## 🎉 Success Criteria

Phase 2 is complete when:

- [x] All event creation fields work
- [x] Event details screen displays everything
- [x] Calendar integration saves events
- [x] Share functionality works
- [x] Navigation flows correctly
- [x] No blocking bugs
- [x] User experience is smooth

---

**Testing Status**: Ready for testing! ✅  
**Recommended Device**: Physical iOS or Android device  
**Fallback**: Use Expo Go on your phone for best results
