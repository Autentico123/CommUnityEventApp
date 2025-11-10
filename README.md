# 📱 CommUnity - Event Sharing App (GROUP 2)

## 📖 About

CommUnity is an event-sharing platform where users can **create, discover, and share** community or school activities. It promotes participation and collaboration within local or academic communities.

### 🎯 Purpose

- Encourage community engagement by sharing events
- Help users discover upcoming local or school events
- Make it easy for participants to save events and get reminders
- Connect people through shared interests and activities

---

## ✨ Features

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

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## 🗄️ MongoDB Setup (NEW!)

The app now uses **MongoDB** as a dynamic database! Follow these steps:

### Option 1: Local MongoDB

```powershell
# 1. Install MongoDB Community Server
# Download from: https://www.mongodb.com/try/download/community

# 2. Start MongoDB service (Windows)
net start MongoDB

# 3. Backend is ready to connect!
```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

### Setup Backend

```powershell
# 1. Navigate to backend folder
cd backend

# 2. Create .env file (already created with defaults)
# Edit .env if using MongoDB Atlas

# 3. Seed the database with sample events (optional)
npm run seed

# 4. Start the backend server
npm run dev
```

You should see:

```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

📖 **Detailed MongoDB setup guide:** [documents/MONGODB_SETUP.md](documents/MONGODB_SETUP.md)

## 📱 Running the App

### On Your Phone (Recommended)

1. **Start Backend Server** (in one terminal):

   ```powershell
   cd backend
   npm run dev
   ```

2. **Start React Native App** (in another terminal):

   ```bash
   npm start
   ```

3. Install **Expo Go** app from App Store or Play Store
4. Scan the QR code with Expo Go
5. ✅ App loads on your device with live MongoDB data!

**Note:** For physical devices, update the API URL in `utils/api.js` to use your computer's IP address:

```javascript
const API_URL = "http://192.168.1.XXX:5000/api"; // Replace with your IP
```

### On Emulator/Simulator

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start React Native
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser
```

## 🌟 Show Your Support

If you like this project, please give it a ⭐️!

**Built with ❤️ using React Native & Expo**

[Report Bug](https://github.com/yourusername/CommunityEventApp/issues) • [Request Feature](https://github.com/yourusername/CommunityEventApp/issues)

</div>
