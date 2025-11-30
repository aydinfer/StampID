/**
 * Design Tokens for StampID
 *
 * A centralized design system inspired by Apple's aesthetic:
 * - Near-monochrome base (white, black, grays)
 * - Frosted glass depth
 * - Color = meaning (not decoration)
 * - Physics-based animations
 * - Typography that breathes
 */

// =============================================================================
// COLORS
// =============================================================================

/**
 * Base Colors - Zinc Scale
 * Foundation for text, backgrounds, borders
 */
export const colors = {
  // Base scale (monochrome foundation)
  white: '#FFFFFF',
  black: '#000000',

  zinc: {
    50: '#FAFAFA',   // App background
    100: '#F4F4F5',  // Secondary background
    200: '#E4E4E7',  // Borders, dividers
    300: '#D4D4D8',  // Disabled states
    400: '#A1A1AA',  // Muted text, placeholders
    500: '#71717A',  // Secondary text
    600: '#52525B',  // Icons inactive
    700: '#3F3F46',  // Subtle emphasis
    800: '#27272A',  // Strong emphasis
    900: '#18181B',  // Primary text
    950: '#09090B',  // Maximum contrast
  },

  // Accent Colors - Soft, purposeful
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',  // Primary actions
    600: '#4F46E5',  // Primary hover
    700: '#4338CA',
  },

  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',  // Success, mint condition
    600: '#0D9488',
    700: '#0F766E',
  },

  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',  // Rare stamps
    600: '#7C3AED',  // Very rare
    700: '#6D28D9',
  },

  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Warnings
    600: '#D97706',
    700: '#B45309',
  },

  rose: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    200: '#FECDD3',
    300: '#FDA4AF',
    400: '#FB7185',
    500: '#F43F5E',  // Favorites, love
    600: '#E11D48',  // Destructive actions
    700: '#BE123C',
  },
} as const;

/**
 * Semantic Color Mapping
 * Use these throughout the app for consistency
 */
export const semanticColors = {
  // Backgrounds
  background: {
    primary: colors.zinc[50],
    secondary: colors.zinc[100],
    tertiary: colors.white,
  },

  // Text
  text: {
    primary: colors.zinc[900],
    secondary: colors.zinc[500],
    muted: colors.zinc[400],
    inverse: colors.white,
  },

  // Borders
  border: {
    default: colors.zinc[200],
    subtle: 'rgba(0, 0, 0, 0.04)',
    strong: colors.zinc[300],
  },

  // Interactive
  interactive: {
    primary: colors.indigo[500],
    primaryHover: colors.indigo[600],
    secondary: colors.zinc[100],
    secondaryHover: colors.zinc[200],
  },

  // Semantic
  success: colors.teal[500],
  warning: colors.amber[600],
  error: colors.rose[600],
  favorite: colors.rose[500],
  rare: colors.violet[500],
  veryRare: colors.violet[600],
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font Families
 * Plus Jakarta Sans for UI, JetBrains Mono for data
 * (Plus Jakarta Sans is similar to Satoshi - clean, geometric, modern)
 */
export const fontFamily = {
  // Sans-serif family
  sans: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemiBold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',
  // Monospace family
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

/**
 * Font Weights
 */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Typography Scale
 * Sizes, weights, and letter-spacing for each text style
 */
export const typography = {
  // Display - Large headlines
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fontFamily.sansBold,
    letterSpacing: -0.64, // -0.02em
  },

  // Title - Screen titles
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamily.sansSemiBold,
    letterSpacing: -0.24, // -0.01em
  },

  // Headline - Section headers
  headline: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamily.sansSemiBold,
    letterSpacing: 0,
  },

  // Body - Primary content
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.sans,
    letterSpacing: 0,
  },

  // Body Medium - Emphasized content
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.sansMedium,
    letterSpacing: 0,
  },

  // Caption - Secondary content
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.sans,
    letterSpacing: 0.14, // 0.01em
  },

  // Micro - Labels, badges
  micro: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.sansMedium,
    letterSpacing: 0.24, // 0.02em
  },

  // Mono - Catalog numbers, prices
  mono: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.mono,
    letterSpacing: 0,
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// =============================================================================
// GLASS STYLES (Frosted Glass)
// =============================================================================

export const glass = {
  // Card - Default content container
  card: {
    blur: 25,
    background: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(0, 0, 0, 0.04)',
    borderWidth: 1,
    shadow: {
      color: 'rgba(0, 0, 0, 0.04)',
      offset: { width: 0, height: 2 },
      radius: 8,
      elevation: 2,
    },
  },

  // Modal - Elevated dialogs
  modal: {
    blur: 40,
    background: 'rgba(255, 255, 255, 0.85)',
    border: 'transparent',
    borderWidth: 0,
    shadow: {
      color: 'rgba(0, 0, 0, 0.08)',
      offset: { width: 0, height: 8 },
      radius: 32,
      elevation: 8,
    },
  },

  // Tab Bar - Navigation
  tabBar: {
    blur: 30,
    background: 'rgba(250, 250, 250, 0.9)',
    border: 'rgba(0, 0, 0, 0.06)',
    borderWidth: 1,
    shadow: null,
  },

  // Sheet - Bottom sheets
  sheet: {
    blur: 50,
    background: 'rgba(255, 255, 255, 0.92)',
    border: 'transparent',
    borderWidth: 0,
    shadow: {
      color: 'rgba(0, 0, 0, 0.06)',
      offset: { width: 0, height: -4 },
      radius: 24,
      elevation: 6,
    },
  },

  // Subtle - Very light glass effect
  subtle: {
    blur: 15,
    background: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    shadow: null,
  },
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

/**
 * Spring Presets
 * Physics-based animation configurations
 */
export const springs = {
  // Snappy - Quick, responsive feedback
  snappy: {
    damping: 20,
    stiffness: 400,
    mass: 1,
  },

  // Smooth - Comfortable transitions
  smooth: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  },

  // Bouncy - Playful, attention-grabbing
  bouncy: {
    damping: 12,
    stiffness: 180,
    mass: 1,
  },

  // Gentle - Slow, elegant
  gentle: {
    damping: 25,
    stiffness: 80,
    mass: 1,
  },

  // Stiff - Minimal overshoot
  stiff: {
    damping: 30,
    stiffness: 300,
    mass: 1,
  },
} as const;

/**
 * Animation Durations (ms)
 */
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
} as const;

/**
 * Press Animation Config
 */
export const pressAnimation = {
  scale: 0.97,
  opacity: 0.9,
  spring: springs.snappy,
} as const;

/**
 * Stagger Animation Config
 */
export const staggerAnimation = {
  delay: 30, // ms between items
  spring: springs.smooth,
} as const;

/**
 * Rare Discovery Animation Config
 */
export const rareDiscoveryAnimation = {
  glowColor: colors.violet[500],
  glowOpacity: 0.12,
  scaleAmount: 1.02,
  duration: 400,
  spring: springs.bouncy,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

// Default export as complete theme
const tokens = {
  colors,
  semanticColors,
  fontFamily,
  fontWeight,
  typography,
  spacing,
  radius,
  glass,
  springs,
  durations,
  pressAnimation,
  staggerAnimation,
  rareDiscoveryAnimation,
  shadows,
} as const;

export default tokens;

// Type exports for TypeScript
export type Colors = typeof colors;
export type SemanticColors = typeof semanticColors;
export type Typography = typeof typography;
export type Glass = typeof glass;
export type Springs = typeof springs;
