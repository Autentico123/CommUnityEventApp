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

---

## 📚 Documentation

- **[Project Guide](./projectguide.md)** - Complete project overview
- **[Clone & Setup Guide](./CLONE_SETUP_GUIDE.md)** - Detailed installation
- **[Quick Start](./QUICKSTART.md)** - Quick reference guide
- **[Phase 1 Documentation](./PHASE1_COMPLETE.md)** - Phase 1 details
- **[Phase 2 Documentation](./PHASE2_COMPLETE.md)** - Phase 2 details
- **[Testing Guide](./PHASE2_TESTING.md)** - How to test features
- **[Expo Go Fix](./EXPO_GO_FIX.md)** - Known issues & solutions

---

## 🗺 Roadmap

### ✅ Phase 1: Setup & Basics (100% Complete)

- [x] Initialize React Native project
- [x] Setup navigation
- [x] Design theme and typography
- [x] Configure local storage
- [x] Create basic screens

### ✅ Phase 2: Core Features (100% Complete)

- [x] Event creation form
- [x] Event discovery screen
- [x] Event details page
- [x] Save to calendar integration
- [x] Share & invite functionality

### 🔄 Phase 3: Engagement Features (30% - Next)

- [ ] User profiles with avatars
- [ ] Event reviews & comments
- [ ] Direct messaging / Chat
- [ ] Enhanced notifications
- [ ] Event ratings

### 🔄 Phase 4: Backend Development (40%)

- [ ] Node.js + Express backend
- [ ] MongoDB database
- [ ] User authentication (JWT)
- [ ] Event API (CRUD)
- [ ] Real-time chat (Socket.io)

### 🔄 Phase 5: Integration & Scaling (20%)

- [ ] Connect frontend to backend
- [ ] Cloud deployment
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Push notifications

---

## 🎨 Design Philosophy

### Color Palette

- **Primary**: #6C63FF (Purple) - Brand color
- **Secondary**: #FF6584 (Pink/Coral) - Accent
- **Background**: #F8F9FA (Light gray)
- **Text**: #2D3436 (Dark gray)

### UI/UX Principles

- **Clean & Modern**: Minimalist design with clear hierarchy
- **Intuitive**: Easy to navigate and use
- **Consistent**: Theme applied throughout
- **Responsive**: Works on all screen sizes
- **Accessible**: Clear labels and feedback

---

## 📦 Project Structure

```
CommunityEventApp/
├── App.js                     # App entry point
├── theme.js                   # Theme configuration
├── package.json               # Dependencies
│
├── navigation/
│   └── MainNavigator.js       # Navigation setup
│
├── screens/
│   ├── HomeScreen.js          # Home screen
│   ├── EventsScreen.js        # Events list
│   ├── EventDetailsScreen.js  # Event details
│   ├── CreateEventScreen.js   # Create event
│   └── ProfileScreen.js       # User profile
│
├── utils/
│   └── storage.js             # Storage helpers
│
├── examples/
│   └── storageExamples.js     # Code examples
│
└── assets/                    # Images & icons
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Test on both iOS and Android
- Update documentation as needed
- Keep components small and focused

---

## 🐛 Known Issues

### Expo Go Limitations

- **Maps**: Native maps not available in Expo Go (placeholder used)
- **Solution**: Use development build for full map support

For more details, see [EXPO_GO_FIX.md](./EXPO_GO_FIX.md)

---

## 📄 License

This project is licensed under the **0BSD License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Project Lead**: Your Name
- **Developers**: Your Team
- **Designers**: Your Design Team

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) - Amazing React Native framework
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [React Native Community](https://reactnative.dev/) - Great documentation
- All contributors and testers

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/CommunityEventApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/CommunityEventApp/discussions)
- **Email**: support@communityapp.com

---

## 🌟 Show Your Support

If you like this project, please give it a ⭐️!

---

<div align="center">

**Built with ❤️ using React Native & Expo**

[Report Bug](https://github.com/yourusername/CommunityEventApp/issues) • [Request Feature](https://github.com/yourusername/CommunityEventApp/issues)

</div>
