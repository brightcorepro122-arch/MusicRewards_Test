// Web-compatible audio service using HTML5 Audio API
export const setupTrackPlayer = async (): Promise<void> => {
  // No setup needed for web - HTML5 Audio API is built-in
  console.log('Web audio service initialized');
};

export const resetPlayer = async (): Promise<void> => {
  // No reset needed for web
};

export const addTrack = async (track: {
  id: string;
  url: string;
  title: string;
  artist: string;
  duration?: number;
}): Promise<void> => {
  // No track adding needed for web - handled by HTML5 Audio
};

export const playTrack = async (): Promise<void> => {
  // No direct play needed for web - handled by HTML5 Audio
};

export const pauseTrack = async (): Promise<void> => {
  // No direct pause needed for web - handled by HTML5 Audio
};

export const seekToPosition = async (seconds: number): Promise<void> => {
  // No direct seek needed for web - handled by HTML5 Audio
};

export const getCurrentPosition = async (): Promise<number> => {
  return 0; // Handled by HTML5 Audio
};

export const getTrackDuration = async (): Promise<number> => {
  return 0; // Handled by HTML5 Audio
};

export const handlePlaybackError = (error: any) => {
  console.error('Playback error:', error);
  return {
    message: error?.message || 'Unknown playback error',
    code: error?.code || 'UNKNOWN_ERROR',
  };
};

export const cleanupTrackPlayer = async (): Promise<void> => {
  // No cleanup needed for web
};
