# 🎵 MusicRewards - React Native Technical Assessment

A fully functional music rewards app that demonstrates modern React Native architecture patterns. Built with Expo, Zustand state management, and a beautiful glass design system.

## 🚀 Features

### Core Features ✅
- **Home Screen**: List of music challenges with play buttons and progress tracking
- **Player Screen**: Full-screen audio player with real-time points counter and controls
- **Profile Screen**: User statistics, achievements, and progress overview
- **Audio Playback**: Complete audio system with expo-av integration
- **Points System**: Real-time points earning during music playback
- **State Persistence**: All data persists across app restarts

### Technical Features ✅
- **Audio Playback**: expo-av integration with remote music URLs
- **State Management**: Zustand stores with AsyncStorage persistence
- **Navigation**: Custom state-based navigation system
- **Real-time Updates**: Live progress tracking and points counter
- **Error Handling**: Comprehensive error handling and loading states
- **Performance**: Optimized with proper cleanup and memory management

### Bonus Features 🎉
- **Achievements System**: 15+ achievements with badges and milestones
- **Daily Challenges**: Rotating daily challenges with special rewards
- **Animated Visualizer**: Real-time music visualizer with smooth animations
- **Enhanced Profile**: Detailed statistics, progress tracking, and achievements
- **Settings System**: Theme toggle and user preferences
- **Offline Indicator**: Network status awareness
- **Share Feature**: Share achievements and progress with friends
- **Level System**: User levels based on total points earned
- **Streak Tracking**: Daily listening streak system

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo (v54)
- **Navigation**: Custom state-based navigation (bypassed Expo Router for stability)
- **State Management**: Zustand with AsyncStorage persistence
- **Audio Playback**: expo-av (replaced react-native-track-player for Expo Go compatibility)
- **Styling**: StyleSheet with custom theme system
- **Architecture**: Hook-based business logic, store-centric state management

### Key Patterns
- **Component Architecture**: Glass design system with blur effects
- **State Management**: Domain-focused Zustand stores (musicStore, userStore)
- **Business Logic**: Custom hooks orchestrate store actions and async operations
- **UI Components**: Reusable glass components with consistent design tokens
- **Navigation**: Modal-heavy architecture with tab-based navigation

##  Sample Challenges

The app includes 5 sample challenges using SoundHelix music tracks:

1. **Classical Masterpiece** by Beethoven (6:12, 50 points, Easy)
2. **Jazz Vibes** by Miles Davis (5:02, 75 points, Medium)
3. **Electronic Beats** by Deadmau5 (5:44, 100 points, Hard)
4. **Acoustic Serenade** by Ed Sheeran (5:02, 60 points, Easy)
5. **Rock Anthem** by Queen (4:30, 80 points, Medium)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20.19.4+ recommended)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npx expo run:ios
   
   # Android
   npx expo run:android
   ```

### Alternative Setup
If you encounter issues with the above commands:
```bash
# Clear Metro cache
npx expo start -c

# Reset dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎵 Audio Setup

The app uses remote audio URLs from SoundHelix:
- All tracks are streamed directly (no local files required)
- Audio playback works with expo-av integration
- Supports play/pause and progress tracking
- Real-time progress updates every second
- Proper audio cleanup and memory management

## 🏪 State Management

### Music Store (`musicStore.ts`)
- Manages challenge data and playback state
- Tracks current track, playing status, and position
- Handles challenge progress and completion
- Persists challenge data to AsyncStorage

### User Store (`userStore.ts`)
- Manages user points and completed challenges
- Tracks total earned points
- Handles challenge completion
- Persists user data to AsyncStorage

### Custom Hooks
- **`useMusicPlayer`**: Audio playback integration with expo-av
- **`usePointsCounter`**: Real-time points tracking during playback
- **Audio Management**: Proper cleanup and state persistence across navigation

### Bonus Stores
- **`achievementsStore`**: Manages 15+ achievements with automatic unlocking
- **`dailyChallengesStore`**: Handles rotating daily challenges and progress
- **`settingsStore`**: User preferences and theme management
- **`userStore`**: Enhanced user data with levels and streaks

## 🚀 Performance Considerations

- **Selectors**: Zustand selectors prevent unnecessary re-renders
- **Audio Management**: Proper cleanup and memory management
- **State Persistence**: Efficient AsyncStorage integration
- **Navigation**: Lightweight state-based navigation
- **Memory Management**: Proper cleanup in useEffect hooks
- **Audio Cleanup**: Prevents memory leaks with proper audio unloading

## 🎉 Key Features Implemented

### Core Functionality ✅
- **Audio Playback**: Complete audio system with expo-av integration
- **Points System**: Real-time points earning during music playback
- **State Management**: Zustand stores with AsyncStorage persistence
- **Navigation**: Custom state-based navigation system
- **Challenge System**: 5 different music challenges with varying difficulty
- **Progress Tracking**: Real-time progress updates and completion detection

### Bonus Features Implemented 🎉
- **Achievements System**: 15+ achievements across 5 categories (listening, points, streak, challenges, special)
- **Daily Challenges**: 6 different challenge types with rotating daily objectives
- **Animated Visualizer**: 8-bar animated music visualizer with intensity control
- **Enhanced Profile**: Detailed stats, achievement gallery, progress tracking
- **Settings System**: Theme toggle (light/dark), user preferences
- **Offline Indicator**: Network status awareness with smooth animations
- **Share Feature**: Share achievements and progress with customizable messages
- **Level System**: Automatic level progression based on total points (1000 points per level)
- **Streak Tracking**: Daily listening streak with automatic calculation
- **Enhanced UI**: Improved navigation, better visual feedback, modern design

## 📦 Dependencies

### Core Dependencies
- `expo`: ~54.0.12
- `react-native`: 0.81.4
- `zustand`: ^5.0.4
- `expo-av`: ~15.0.1

### Storage & State
- `@react-native-async-storage/async-storage`: 2.2.0

### Development
- `typescript`: Latest
- `@types/react`: Latest
- `@types/react-native`: Latest

## 🎯 Project Summary

This enhanced MusicRewards app demonstrates:

- **Modern React Native Architecture**: Clean, maintainable code with proper separation of concerns
- **Advanced State Management**: Multiple Zustand stores with persistence for complex app state
- **Rich User Experience**: Achievements, daily challenges, visual feedback, and social sharing
- **Performance Optimization**: Efficient selectors, proper cleanup, and memory management
- **Cross-platform Compatibility**: Works seamlessly on iOS and Android via Expo Go
- **Production Ready**: Comprehensive error handling, loading states, and user feedback

## 🚀 Ready for Production

The app is fully functional with both core requirements and extensive bonus features, ready for submission and production deployment.

---

**Built with ❤️ using React Native, Expo, and modern development practices**
