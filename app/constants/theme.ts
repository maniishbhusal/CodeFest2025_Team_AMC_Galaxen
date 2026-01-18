/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Main theme colors: Orange theme for AutiSahara
const primaryOrange = "#F97316"; // Orange 500
const lightOrange = "#FFEDD5"; // Orange 100
const darkOrange = "#EA580C"; // Orange 600
const accentOrange = "#FB923C"; // Orange 400
const paleOrange = "#FFF7ED"; // Orange 50
const white = "#FFFFFF";
const offWhite = "#FAFAFA";
const lightGray = "#E5E7EB";
const mediumGray = "#9CA3AF";
const darkGray = "#374151";

export const AppColors = {
  primary: primaryOrange,
  primaryLight: lightOrange,
  primaryDark: darkOrange,
  secondary: accentOrange,
  secondaryLight: paleOrange,
  white: white,
  background: offWhite,
  surface: white,
  border: lightGray,
  textPrimary: darkGray,
  textSecondary: mediumGray,
  textLight: "#6B7280",
  error: "#EF4444",
  success: "#10B981",
  disabled: mediumGray,
};

const tintColorLight = primaryOrange;
const tintColorDark = accentOrange;

export const Colors = {
  light: {
    text: darkGray,
    background: white,
    tint: tintColorLight,
    icon: mediumGray,
    tabIconDefault: mediumGray,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
