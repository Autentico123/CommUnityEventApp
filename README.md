# 📱 CommUnity - Event Sharing App

<div align="center">

![CommUnity Logo](./assets/icon.png)

**A community-focused event sharing platform built with React Native & Expo**

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-black.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-0BSD-green.svg)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Screenshots](#-screenshots) • [Documentation](#-documentation) • [Roadmap](#-roadmap)

</div>

---

## 📖 About

CommUnity is an event-sharing platform where users can **create, discover, and share** community or school activities. It promotes participation and collaboration within local or academic communities.

### 🎯 Purpose

- Encourage community engagement by sharing events
- Help users discover upcoming local or school events
- Make it easy for participants to save events and get reminders
- Connect people through shared interests and activities

---

## ✨ Features

### ✅ Implemented (Phase 1 & 2 - 100% Complete)

#### 🏠 **Home Screen**

- Featured events showcase
- Quick action buttons (Browse/Create)
- Event categories display
- Clean, modern UI

#### 🎉 **Event Discovery**

- Browse all events
- Search functionality
- Filter by category (Community, Music, Sports, Education, etc.)
- Interactive event cards

#### ✍️ **Event Creation**

- Complete event form (title, date, time, location, description)
- Category selection (6 options)
- Native date/time pickers (iOS & Android optimized)
- Form validation
- Success confirmation

#### 📱 **Event Details**

- Comprehensive event information
- Location display with map placeholder
- Save to favorites (heart icon)
- **Add to Calendar** (with reminders)
- **Share Event** (native share functionality)
- Get Directions button
- "I'm Attending" feature

#### 👤 **User Profile**

- User stats (Events Joined, Created, Followers)
- Quick access menu
- Settings options
- Edit profile capability

#### 🎨 **Design System**

- Custom theme (Purple & Pink palette)
- Consistent typography
- Responsive layouts
- Material Design-inspired cards
- Smooth animations

---

## 🚀 Installation

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/CommunityEventApp.git

# Navigate to directory
cd CommunityEventApp

# Install dependencies
npm install

# Start the app
npm start
```

### Detailed Setup

For detailed installation instructions, see [CLONE_SETUP_GUIDE.md](./CLONE_SETUP_GUIDE.md)

---

## 📱 Running the App

### On Your Phone (Recommended)

1. Install **Expo Go** app from App Store or Play Store
2. Run `npm start` in your terminal
3. Scan the QR code with Expo Go
4. ✅ App loads on your device!

### On Emulator/Simulator

```bash
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser
```

---

## 📸 Screenshots

<div align="center">

| Home Screen                           | Events List                               | Event Details                               |
| ------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| ![Home](./assets/screenshot-home.png) | ![Events](./assets/screenshot-events.png) | ![Details](./assets/screenshot-details.png) |

| Create Event                              | Profile                                     | Calendar Integration                          |
| ----------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| ![Create](./assets/screenshot-create.png) | ![Profile](./assets/screenshot-profile.png) | ![Calendar](./assets/screenshot-calendar.png) |

</div>

---

## 🛠 Tech Stack

### Frontend (Mobile)

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation (Stack + Tab)
- **Storage**: AsyncStorage
- **Calendar**: Expo Calendar
- **Sharing**: Expo Sharing
- **Maps**: Map Placeholder (Expo Go compatible)

### Upcoming (Phase 4)

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (JSON Web Token)
- **Real-time**: Socket.io
- **Storage**: Cloudinary / Firebase

## 🌟 Show Your Support

If you like this project, please give it a ⭐️!

**Built with ❤️ using React Native & Expo**

[Report Bug](https://github.com/yourusername/CommunityEventApp/issues) • [Request Feature](https://github.com/yourusername/CommunityEventApp/issues)

</div>
