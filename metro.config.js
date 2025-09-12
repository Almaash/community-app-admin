const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Support SVG as components
// config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// Remove svg from assetExts, and add it to sourceExts
const assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
const sourceExts = [...config.resolver.sourceExts, "svg"];

config.resolver.assetExts = assetExts;
config.resolver.sourceExts = sourceExts;

module.exports = withNativeWind(config, { input: './global.css' });
