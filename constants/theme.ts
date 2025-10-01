/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Islamic green color palette
const islamicGreenLight = '#059669'; // emerald-600
const islamicGreenDark = '#10b981'; // emerald-500
const goldAccent = '#f59e0b'; // amber-500

export const Colors = {
  light: {
    text: '#0f172a',
    background: '#f8fafc',
    tint: islamicGreenLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: islamicGreenLight,
    primary: islamicGreenLight,
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
    secondary: goldAccent,
    accent: '#0ea5e9', // sky-500
    cardBg: '#ffffff',
    border: '#e2e8f0',
  },
  dark: {
    text: '#f1f5f9',
    background: '#0f172a',
    tint: islamicGreenDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: islamicGreenDark,
    primary: islamicGreenDark,
    primaryLight: '#065f46',
    primaryDark: '#34d399',
    secondary: goldAccent,
    accent: '#38bdf8',
    cardBg: '#1e293b',
    border: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
