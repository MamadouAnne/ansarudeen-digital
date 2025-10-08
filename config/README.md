# Configuration Files

This directory contains all configuration files for the Ansarudeen Digital app.

## Files

- `babel.config.js` - Babel transpiler configuration
- `metro.config.js` - Metro bundler configuration
- `tailwind.config.js` - TailwindCSS/NativeWind configuration
- `tsconfig.json` - TypeScript compiler configuration

## Symlinks

Configuration files are symlinked to the root directory for compatibility:
- `/babel.config.js` → `/config/babel.config.js`
- `/metro.config.js` → `/config/metro.config.js`
- `/tailwind.config.js` → `/config/tailwind.config.js`
- `/tsconfig.json` → `/config/tsconfig.json`

## Root Config Files

The following config files remain in the root:
- `.eslintrc.js` - ESLint linting configuration
- `app.json` - Expo app configuration
- `package.json` - NPM package configuration
- `.env` - Environment variables (gitignored)
- `.env.example` - Environment template
