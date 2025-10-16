// Crossfade hook for smooth track transitions
import { useState, useCallback, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';

export interface CrossfadeConfig {
  duration: number; // in milliseconds
  fadeOutStart: number; // percentage of track to start fade out
  fadeInDuration: number; // duration of fade in
}

export const useCrossfade = () => {
  const [isCrossfading, setIsCrossfading] = useState(false);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout>();

  const crossfadeToTrack = useCallback(async (
    currentTrackId: string,
    nextTrackId: string,
    config: CrossfadeConfig = {
      duration: 3000,
      fadeOutStart: 0.8, // Start fade out at 80% of track
      fadeInDuration: 1000,
    }
  ) => {
    try {
      setIsCrossfading(true);

      // Get current track duration
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (!currentTrack) return;

      const trackDuration = currentTrack.duration || 0;
      const fadeOutStartTime = trackDuration * config.fadeOutStart;

      // Set up fade out
      const fadeOutTimeout = setTimeout(async () => {
        try {
          // Start next track at low volume
          await TrackPlayer.add({
            id: nextTrackId,
            url: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3', // This would be dynamic
            title: 'Next Track',
            artist: 'Artist',
          });

          // Fade out current track and fade in next track
          // Note: This is a simplified implementation
          // Real crossfade would require volume control
          
          await TrackPlayer.skipToNext();
          setIsCrossfading(false);
        } catch (error) {
          console.error('Crossfade error:', error);
          setIsCrossfading(false);
        }
      }, fadeOutStartTime * 1000);

      crossfadeTimeoutRef.current = fadeOutTimeout;

    } catch (error) {
      console.error('Crossfade setup error:', error);
      setIsCrossfading(false);
    }
  }, []);

  const cancelCrossfade = useCallback(() => {
    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = undefined;
    }
    setIsCrossfading(false);
  }, []);

  return {
    isCrossfading,
    crossfadeToTrack,
    cancelCrossfade,
  };
};


