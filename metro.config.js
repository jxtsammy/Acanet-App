const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('cjs'); // Example for Lottie files

module.exports = defaultConfig;