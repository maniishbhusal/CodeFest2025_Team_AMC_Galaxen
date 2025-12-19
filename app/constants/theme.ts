/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Main theme colors: White, Light Blue, and Light Pink
const primaryBlue = "#ADD8E6"; // Light blue
const lightBlue = "#D6EAF8"; // Lighter blue variant
const darkBlue = "#87CEEB"; // Darker light blue
const pantonePink = "#FDB5CE"; // Light pink
const lightPink = "#FFD4E0"; // Lighter pink variant
const white = "#FFFFFF";
const offWhite = "#FAFAFA";
const lightGray = "#E8E8E8";
const mediumGray = "#999999";
const darkGray = "#555555";

export const AppColors = {
  primary: primaryBlue,
  primaryLight: lightBlue,
  primaryDark: darkBlue,
  secondary: pantonePink,
  secondaryLight: lightPink,
  white: white,
  background: offWhite,
  surface: white,
  border: lightGray,
  textPrimary: darkGray,
  textSecondary: mediumGray,
  textLight: "#777777",
  error: "#EF4444",
  success: primaryBlue,
  disabled: mediumGray,
};

const tintColorLight = primaryBlue;
const tintColorDark = pantonePink;

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
