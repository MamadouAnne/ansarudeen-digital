const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get project root (parent directory of config folder)
const projectRoot = path.resolve(__dirname, '..');

const config = getDefaultConfig(projectRoot);

const { withNativeWind } = require('nativewind/metro');

module.exports = withNativeWind(config, { input: './global.css' });