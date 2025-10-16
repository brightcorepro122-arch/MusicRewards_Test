// Root layout for Expo Router
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
// import { ToastContainer } from '../components/ui/ToastContainer';
// import { OfflineIndicator } from '../components/ui/OfflineIndicator';

// Conditional import for TrackPlayer (only works in development builds, not Expo Go)
let TrackPlayer: any = null;
let setupTrackPlayer: any = null;

// Check if we're in Expo Go environment
const isExpoGo = typeof __DEV__ !== 'undefined' && __DEV__;

if (!isExpoGo) {
  try {
    TrackPlayer = require('react-native-track-player').default;
    setupTrackPlayer = require('../services/audioService').setupTrackPlayer;
  } catch (error) {
    console.log('TrackPlayer not available - audio features disabled');
  }
} else {
  console.log('TrackPlayer disabled in Expo Go - audio features disabled');
}

export default function RootLayout() {
  useEffect(() => {
    if (TrackPlayer && setupTrackPlayer) {
      try {
        // Register the playback service first
        TrackPlayer.registerPlaybackService(() => require('../services/playbackService'));
        
        // Then initialize TrackPlayer when app starts
        setupTrackPlayer().catch((error) => {
          console.error('Failed to setup TrackPlayer:', error);
        });
      } catch (error) {
        console.log('TrackPlayer initialization failed:', error);
      }
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(modals)" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
      </Stack>
      {/* Temporarily disabled to avoid loading issues */}
      {/* <ToastContainer />
      <OfflineIndicator /> */}
    </View>
  );
}