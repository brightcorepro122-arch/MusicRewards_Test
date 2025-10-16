# 🎵 MusicRewards - React Native Technical Assessment

A simplified music rewards app that demonstrates core architectural patterns used in the Belong mobile app. Built with React Native, Expo, and modern state management.

## 🚀 Features

### Core Features
- **Home Screen**: List of music challenges with play buttons
- **Player Modal**: Full-screen audio player with real-time points counter
- **Profile Screen**: User progress, total earned points, and achievements
- **Challenge Detail**: Individual challenge view with completion tracking

### Technical Features
- **Audio Playback**: react-native-track-player integration with remote URLs
- **State Management**: Zustand stores with AsyncStorage persistence
- **Glass Design System**: Blur effects and gradient components
- **Real-time Points**: Live points counter during audio playback
- **Navigation**: Expo Router with file-based routing and modals

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo (v54)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with persistence (AsyncStorage)
- **Audio Playback**: react-native-track-player
- **Styling**: StyleSheet with Glass/Blur effects (expo-blur)
- **Architecture**: Hook-based business logic, store-centric state management

### Key Patterns
- **Component Architecture**: Glass design system with blur effects
- **State Management**: Domain-focused Zustand stores (musicStore, userStore)
- **Business Logic**: Custom hooks orchestrate store actions and async operations
- **UI Components**: Reusable glass components with consistent design tokens
- **Navigation**: Modal-heavy architecture with tab-based navigation

## 📱 Screens

### Home Screen (`/`)
- Displays list of music challenges
- Play buttons for each challenge
- Progress indicators
- Navigation to challenge details

### Player Modal (`/(modals)/player`)
- Full-screen audio player
- Real-time points counter
- Progress bar with seek functionality
- Play/pause controls
- Challenge completion tracking

### Profile Screen (`/profile`)
- User statistics (total points, completed challenges)
- Challenge progress overview
- Achievement system
- Completion rates

### Challenge Detail (`/(modals)/challenge-detail`)
- Individual challenge information
- Detailed progress tracking
- Manual completion option
- Challenge metadata

## 🎯 Sample Challenges

The app includes 3 sample challenges using real Belong tracks:

1. **All Night** by Camo & Krooked (3:39, 150 points, Easy)
2. **New Forms** by Roni Size (7:44, 300 points, Medium)  
3. **Bonus Challenge** by Camo & Krooked (3:39, 250 points, Hard)

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

The app uses remote audio URLs from Belong's S3 bucket:
- All tracks are streamed directly (no local files required)
- Audio playback works in background
- Supports seek, play/pause, and progress tracking
- Handles audio interruptions gracefully

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
- **`useMusicPlayer`**: Audio playback integration
- **`usePointsCounter`**: Real-time points tracking
- **`useChallenges`**: Challenge management

## 🎨 Design System

### Glass Components
- **GlassCard**: Blur background with gradient borders
- **GlassButton**: Interactive buttons with glass effects
- **Design Tokens**: Consistent spacing, colors, and typography

### Theme
- **Colors**: Belong purple (#7553DB), green (#34CB76), yellow (#FCBE25)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 8px grid system
- **Border Radius**: Consistent rounded corners

## 🧪 Testing

### Manual Testing Checklist
- [ ] App launches successfully
- [ ] Audio plays correctly with system volume
- [ ] Points increment during playback
- [ ] App state persists after restart
- [ ] Handles audio interruptions gracefully
- [ ] Modal navigation works smoothly
- [ ] Challenge completion tracking works
- [ ] Profile screen shows correct statistics

### Test Scenarios
1. **Basic Playback**: Play a track and verify audio works
2. **Points Earning**: Verify points increment during playback
3. **State Persistence**: Close and reopen app, verify data persists
4. **Challenge Completion**: Complete a challenge and verify points are awarded
5. **Navigation**: Test all navigation flows and modal presentations

## 🚀 Performance Considerations

- **Selectors**: Zustand selectors prevent unnecessary re-renders
- **Memoization**: Components use React.memo where appropriate
- **Audio Caching**: TrackPlayer configured with 10MB cache
- **Lazy Loading**: Modals load only when needed
- **Memory Management**: Proper cleanup in useEffect hooks

## 🎉 Bonus Features Implemented

### Advanced UI Components
- **Confetti Animation**: Custom confetti celebration for points earned
- **Audio Visualizer**: Real-time animated bars during playback
- **Toast Notifications**: Slide-in notifications with different types
- **Points Counter**: Animated counter with celebration effects
- **Glass Design System**: Blur effects with gradient overlays
- **Theme Toggle**: Dark/light mode switching capability

### Advanced Functionality
- **Cross-platform Support**: Web version with fallback UI
- **Network Status**: Offline indicator with connection monitoring
- **Optimistic Updates**: Immediate UI updates with rollback capability
- **Crossfade Effects**: Smooth transitions between tracks
- **Haptic Feedback**: Touch feedback for interactions
- **State Persistence**: AsyncStorage integration for offline data

### Performance Optimizations
- **Selective Re-renders**: Zustand selectors prevent unnecessary updates
- **Memoized Components**: React.memo for expensive components
- **Lazy Loading**: Modal components load on demand
- **Memory Management**: Proper cleanup in useEffect hooks
- **Audio Caching**: TrackPlayer configured with 10MB cache

## 🐛 Known Issues & Limitations

- **Expo Go Compatibility**: Some native modules require development builds
- **Node Version**: Requires Node.js v20.19.4+ for optimal performance
- **Audio Interruptions**: Basic handling implemented, could be enhanced
- **Offline Mode**: Not implemented (requires network for audio)
- **Background Playback**: Basic implementation, could be enhanced

## ✅ Project Status: READY FOR SUBMISSION

### Core Requirements ✅
- [x] React Native with Expo Router
- [x] Audio playback with react-native-track-player
- [x] State management with Zustand + AsyncStorage
- [x] Glass design system with blur effects
- [x] Real-time points counter
- [x] Challenge completion tracking
- [x] Modal navigation architecture
- [x] Profile screen with statistics

### Bonus Features ✅
- [x] Confetti animations for celebrations
- [x] Audio visualizer during playback
- [x] Toast notification system
- [x] Cross-platform web support
- [x] Network status monitoring
- [x] Optimistic UI updates
- [x] Haptic feedback integration
- [x] Advanced glass design system
- [x] Performance optimizations

## 📦 Dependencies

### Core Dependencies
- `expo`: ~54.0.12
- `react-native`: 0.81.4
- `expo-router`: 3.5.23
- `zustand`: ^5.0.4
- `react-native-track-player`: ^4.1.2

### UI Dependencies
- `expo-blur`: ~15.0.7
- `expo-linear-gradient`: ~15.0.7
- `react-native-gesture-handler`: ~2.28.0
- `react-native-reanimated`: ~4.1.2

### Storage
- `@react-native-async-storage/async-storage`: 2.2.0

## 🤝 Contributing

This is a technical assessment project. For questions or issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Clear Metro cache if experiencing build issues
4. Ensure Node.js version compatibility

## 📄 License

This project is for assessment purposes only.

---

**Built with ❤️ using React Native and Expo**
