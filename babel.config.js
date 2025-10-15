module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Only include reanimated plugin for native platforms
      ...(process.env.EXPO_PLATFORM !== 'web' ? ['react-native-reanimated/plugin'] : []),
    ],
  };
};
