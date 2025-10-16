// Theme constants for MusicRewards app - Belong's design system
export const THEME = {
  colors: {
    // Primary brand colors
    primary: '#7553DB',
    secondary: '#34CB76',
    accent: '#FF6B6B',
    
    // Background colors
    background: '#1a1a1a',
    surface: '#2a2a2a',
    card: '#333333',
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      muted: '#999999',
      inverse: '#000000',
    },
    
    // Status colors
    success: '#34CB76',
    warning: '#FFA726',
    error: '#FF6B6B',
    info: '#42A5F5',
    
    // Border colors
    border: '#333333',
    borderLight: '#444444',
    
    // Glass effect colors
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      dark: 'rgba(0, 0, 0, 0.3)',
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
  
  fonts: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // Glass design system
  glass: {
    blurIntensity: 20,
    gradientColors: {
      card: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      button: ['rgba(117, 83, 219, 0.8)', 'rgba(117, 83, 219, 0.6)'],
      success: ['rgba(52, 203, 118, 0.8)', 'rgba(52, 203, 118, 0.6)'],
    },
  },
  
  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Layout constants
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    modalPadding: 20,
  },
};
