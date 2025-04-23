import { MD3LightTheme, configureFonts } from "react-native-paper";

const fontConfig = {
  fontFamily: "Inter-Regular",
  titleLarge: {
    fontFamily: "Inter-Bold",
  },
  titleMedium: {
    fontFamily: "Inter-SemiBold",
  },
  titleSmall: {
    fontFamily: "Inter-Medium",
  },
  bodyLarge: {
    fontFamily: "Inter-Regular",
  },
  bodyMedium: {
    fontFamily: "Inter-Regular",
  },
  bodySmall: {
    fontFamily: "Inter-Regular",
  },
  labelLarge: {
    fontFamily: "Inter-Medium",
  },
  labelMedium: {
    fontFamily: "Inter-Medium",
  },
  labelSmall: {
    fontFamily: "Inter-Medium",
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#D4AF37", // Rich gold
    primaryContainer: "#FFF8E1", // Very light gold
    secondary: "#000000", // Black
    secondaryContainer: "#F5F5F5", // Light gray/off-white
    tertiary: "#9D8221", // Darker gold
    tertiaryContainer: "#FFF8DC", // Cream/light gold
    error: "#B71C1C", // Dark red
    errorContainer: "#FFEBEE", // Light red
    background: "#FFFFFF", // White
    surface: "#FFFFFF", // White
    surfaceVariant: "#F8F8F8", // Very light gray
    outline: "#E0E0E0", // Light gray
    onPrimary: "#000000", // Black text on gold
    onBackground: "#000000", // Black text on white
    onSurface: "#000000", // Black text on white
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme = {
  ...MD3LightTheme,
  dark: true,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#D4AF37", // Rich gold
    primaryContainer: "#3A3000", // Very dark gold
    secondary: "#FFFFFF", // White
    secondaryContainer: "#2A2A2A", // Dark gray
    tertiary: "#BFA730", // Slightly lighter gold
    tertiaryContainer: "#2C2500", // Very dark gold
    error: "#CF6679", // Pink/red
    errorContainer: "#3D0000", // Very dark red
    background: "#000000", // Black
    surface: "#121212", // Very dark gray
    surfaceVariant: "#1E1E1E", // Dark gray
    outline: "#333333", // Medium gray
    onPrimary: "#000000", // Black text on gold
    onBackground: "#FFFFFF", // White text on black
    onSurface: "#FFFFFF", // White text on dark surfaces
  },
  fonts: configureFonts({ config: fontConfig }),
};
