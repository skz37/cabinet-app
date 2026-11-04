import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

/**
 * MediFlow colours for code that cannot use classes (navigation theme, status bar,
 * native props such as placeholderTextColor). Keep in sync with global.css.
 */
export const THEME = {
  light: {
    background: '#F4F7F7',
    foreground: '#0E1F22',
    card: '#FFFFFF',
    mutedForeground: '#4A5C60',
    border: '#E6ECED',
    input: '#C9D5D7',
    primary: '#0F766E',
    primaryForeground: '#FFFFFF',
    primarySoft: '#E3F2F0',
    destructive: '#B91C1C',
  },
  dark: {
    background: '#0B1416',
    foreground: '#E6EEEF',
    card: '#132124',
    mutedForeground: '#A9BBBE',
    border: '#2A3B3F',
    input: '#3A4E52',
    primary: '#2DD4BF',
    primaryForeground: '#04201D',
    primarySoft: '#123A37',
    destructive: '#F87171',
  },
};

const FONTS: Theme['fonts'] = {
  regular: { fontFamily: 'Figtree_400Regular', fontWeight: '400' },
  medium: { fontFamily: 'Figtree_500Medium', fontWeight: '500' },
  bold: { fontFamily: 'Figtree_700Bold', fontWeight: '700' },
  heavy: { fontFamily: 'Figtree_800ExtraBold', fontWeight: '800' },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    fonts: FONTS,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    fonts: FONTS,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
