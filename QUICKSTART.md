# 🚀 CommUnity App - Quick Start Guide

## Running the App

The Expo development server is currently running! Here are your options:

### 📱 Test on Mobile Device

1. Download **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Open Expo Go and scan the QR code shown in the terminal
3. The app will load on your device

### 💻 Test on Web Browser

Press `w` in the terminal to open the app in your default web browser

### 📱 Test on Emulator/Simulator

- **Android**: Press `a` (requires Android Studio with emulator)
- **iOS**: Press `i` (requires Xcode on macOS)

## Other Commands

- `r` - Reload the app
- `j` - Open React DevTools debugger
- `m` - Toggle developer menu
- `Ctrl+C` - Stop the development server

## 📂 Project Structure Quick Reference

```
├── App.js                    # Main entry point
├── theme.js                  # Colors, fonts, spacing
├── navigation/
│   └── MainNavigator.js      # Tab navigation
├── screens/
│   ├── HomeScreen.js         # Home tab
│   ├── EventsScreen.js       # Events tab
│   └── ProfileScreen.js      # Profile tab
└── utils/
    └── storage.js            # Local storage helper
```

## 🎨 Theme Colors

- **Primary**: #6C63FF (Purple)
- **Secondary**: #FF6584 (Pink/Coral)
- **Background**: #F8F9FA (Light Gray)
- **Text**: #2D3436 (Dark Gray)

## 📝 Key Features Implemented

✅ Bottom tab navigation (Home, Events, Profile)
✅ Themed UI components
✅ AsyncStorage utility for data persistence
✅ Search functionality on Events screen
✅ Event cards with actions
✅ User profile with stats
✅ Responsive layouts with ScrollViews

## 🔧 Development Tips

1. **Hot Reload**: Changes to code automatically update the app
2. **Theme**: All styles use the theme.js constants
3. **Storage**: Use utils/storage.js for saving data locally
4. **Navigation**: Access navigation prop in screens to navigate

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

Happy coding! 🎉
