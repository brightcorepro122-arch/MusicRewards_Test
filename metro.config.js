// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Fix for web bundling issues
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-web': 'react-native-web',
};

// Add web-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.jsx', 'web.ts', 'web.tsx'];

module.exports = config;
