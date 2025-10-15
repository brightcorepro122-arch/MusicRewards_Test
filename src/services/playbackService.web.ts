// Web-compatible playback service - no background playback needed
export default async function playbackService() {
  // No background playback service needed for web
  console.log('Web playback service initialized');
}

// Also export as module.exports for compatibility
module.exports = playbackService;
