// Root layout for Expo Router
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { setupTrackPlayer } from '../services/audioService';

export default function RootLayout() {
  useEffect(() => {
    // Only setup TrackPlayer on native platforms
    if (Platform.OS !== 'web') {
      try {
        const TrackPlayer = require('react-native-track-player').default;
        
        // Register the playback service first
        TrackPlayer.registerPlaybackService(() => require('../services/playbackService'));
        
        // Then initialize TrackPlayer when app starts
        setupTrackPlayer().catch((error) => {
          console.error('Failed to setup TrackPlayer:', error);
        });
      } catch (error) {
        console.log('TrackPlayer not available on this platform');
      }
    } else {
      // Initialize web audio service
      setupTrackPlayer().catch((error) => {
        console.error('Failed to setup web audio service:', error);
      });
    }
  }, []);

  return (
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
  );
}