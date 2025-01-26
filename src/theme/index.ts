export const theme = {
  colors: {
    primary: '#4285F4',
    background: '#ffffff',
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
    },
    border: '#e0e0e0',
    error: '#f44336',
    success: '#4caf50',
  },
  typography: {
    fontSize: {
      heading1: 32,
      heading2: 24,
      heading3: 20,
      body: 16,
      caption: 14,
      display: 48,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
    full: 9999,
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;

// Helper functions for type-safe theme access
export const getColor = (color: keyof typeof theme.colors) => theme.colors[color];
export const getFontSize = (size: keyof typeof theme.typography.fontSize) => theme.typography.fontSize[size];
export const getFontWeight = (weight: keyof typeof theme.typography.fontWeight) => theme.typography.fontWeight[weight];
export const getSpacing = (space: keyof typeof theme.spacing) => theme.spacing[space];
export const getBorderRadius = (radius: keyof typeof theme.borderRadius) => theme.borderRadius[radius];
export const getShadow = (shadowSize: keyof typeof theme.shadow) => theme.shadow[shadowSize];
