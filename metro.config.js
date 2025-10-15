const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper module resolution for web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

// Disable Hermes for web (Hermes is native-only)
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  // Force disable Hermes for web
  hermesParser: false,
};

// Override transform engine for web to avoid Hermes
config.transformer.getTransformOptions = async (entryPoints, options) => {
  const defaultOptions = {
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  };

  // Disable Hermes for web platform
  if (options.platform === 'web') {
    return {
      ...defaultOptions,
      transform: {
        ...defaultOptions.transform,
        hermesParser: false,
      },
    };
  }

  return defaultOptions;
};

module.exports = config;
