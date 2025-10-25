// Theme System - Complete design tokens
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',

  // Backgrounds
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F8F8',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',

  // States
  hover: 'rgba(0, 122, 255, 0.1)',
  pressed: 'rgba(0, 122, 255, 0.2)',
  selected: '#E3F2FD',
  disabled: '#F5F5F5',

  // Camera
  cameraBackground: '#1C1C1E',
  edgeDetected: 'rgba(255, 204, 0, 0.8)',
  edgeStable: 'rgba(52, 199, 89, 0.8)',
  gridLine: 'rgba(255, 255, 255, 0.3)',

  // Gradients
  gradientPrimary: ['#007AFF', '#5856D6'],
  gradientSuccess: ['#34C759', '#30D158'],
  gradientWarning: ['#FF9500', '#FF8C00'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 34,
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  spring: {
    gentle: { stiffness: 180, damping: 18 },
    medium: { stiffness: 240, damping: 20 },
    snappy: { stiffness: 320, damping: 22 },
    bouncy: { stiffness: 200, damping: 12 },
  },
};

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.md,
  maxContentWidth: 600,

  // Component heights
  headerHeight: 56,
  tabBarHeight: 64,
  toolbarHeight: 72,
  fabSize: 56,
  buttonHeight: {
    small: 32,
    medium: 44,
    large: 52,
  },
};

export const zIndex = {
  base: 0,
  dropdown: 10,
  modal: 100,
  popover: 200,
  tooltip: 300,
  notification: 400,
  loader: 500,
};

// Theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
  layout,
  zIndex,
};

export type Theme = typeof theme;
