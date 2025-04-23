import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'Inter-Regular',
  titleLarge: {
    fontFamily: 'Inter-Bold',
  },
  titleMedium: {
    fontFamily: 'Inter-SemiBold',
  },
  titleSmall: {
    fontFamily: 'Inter-Medium',
  },
  bodyLarge: {
    fontFamily: 'Inter-Regular',
  },
  bodyMedium: {
    fontFamily: 'Inter-Regular',
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
  },
  labelLarge: {
    fontFamily: 'Inter-Medium',
  },
  labelMedium: {
    fontFamily: 'Inter-Medium',
  },
  labelSmall: {
    fontFamily: 'Inter-Medium',
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A84FF',
    primaryContainer: '#EBF6FF',
    secondary: '#30D158',
    secondaryContainer: '#E1F5E8',
    tertiary: '#FF9F0A',
    tertiaryContainer: '#FFF2E6',
    error: '#FF3B30',
    errorContainer: '#FFECEC',
    background: '#F8F8F8',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F0',
    outline: '#E5E5E5',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme = {
  ...MD3LightTheme,
  dark: true,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A84FF',
    primaryContainer: '#193B54',
    secondary: '#30D158',
    secondaryContainer: '#194D29',
    tertiary: '#FF9F0A',
    tertiaryContainer: '#543D1D',
    error: '#FF3B30',
    errorContainer: '#541F1D',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    outline: '#3A3A3A',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
  fonts: configureFonts({ config: fontConfig }),
};