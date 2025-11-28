/** @type {import('tailwindcss').Config} */

// Design tokens imported for Tailwind configuration
// Note: These are duplicated here because Tailwind config runs at build time
// The source of truth is lib/design/tokens.ts

const colors = {
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
};

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Zinc scale (primary grays)
        zinc: colors.zinc,

        // Accent colors
        indigo: colors.indigo,
        teal: colors.teal,
        violet: colors.violet,
        amber: colors.amber,
        rose: colors.rose,

        // Semantic aliases (for easy refactoring)
        background: {
          DEFAULT: colors.zinc[50],
          secondary: colors.zinc[100],
          tertiary: colors.white,
        },

        surface: {
          DEFAULT: colors.white,
          glass: 'rgba(255, 255, 255, 0.72)',
        },

        text: {
          DEFAULT: colors.zinc[900],
          secondary: colors.zinc[500],
          muted: colors.zinc[400],
          inverse: colors.white,
        },

        border: {
          DEFAULT: colors.zinc[200],
          subtle: 'rgba(0, 0, 0, 0.04)',
        },

        // Interactive states
        primary: {
          DEFAULT: colors.indigo[500],
          hover: colors.indigo[600],
          light: colors.indigo[50],
        },

        // Semantic colors
        success: {
          DEFAULT: colors.teal[500],
          light: colors.teal[50],
        },
        warning: {
          DEFAULT: colors.amber[600],
          light: colors.amber[50],
        },
        error: {
          DEFAULT: colors.rose[600],
          light: colors.rose[50],
        },
        favorite: {
          DEFAULT: colors.rose[500],
          light: colors.rose[50],
        },
        rare: {
          DEFAULT: colors.violet[500],
          light: colors.violet[50],
        },

        // Legacy colors (for backwards compatibility during migration)
        // TODO: Remove these after updating all components
        forest: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#6366F1', // Map to indigo primary
          950: '#312E81',
        },
        cream: {
          DEFAULT: colors.zinc[50],
          50: colors.white,
          100: colors.zinc[50],
          200: colors.zinc[100],
          300: colors.zinc[200],
        },
        ink: {
          DEFAULT: colors.zinc[900],
          light: colors.zinc[500],
          muted: colors.zinc[400],
        },
      },

      // Font families
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        'sans-medium': ['PlusJakartaSans_500Medium'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-medium': ['JetBrainsMono_500Medium'],
      },

      // Font sizes with line heights
      fontSize: {
        'display': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'title': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'headline': ['20px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'caption': ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'micro': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      },

      // Glass effect blur
      backdropBlur: {
        glass: '25px',
        'glass-modal': '40px',
        'glass-sheet': '50px',
      },

      // Shadows
      boxShadow: {
        'glass': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'glass-md': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-xl': '0 16px 48px rgba(0, 0, 0, 0.12)',
      },

      // Border radius
      borderRadius: {
        'glass': '16px',
        'glass-lg': '20px',
        'glass-xl': '24px',
      },

      // Opacity values for glass
      opacity: {
        'glass': '0.72',
        'glass-modal': '0.85',
        'glass-sheet': '0.92',
      },
    },
  },
  plugins: [],
}
