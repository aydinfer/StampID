/** @type {import('tailwindcss').Config} */
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
        // Primary Brand Color - Forest Green
        forest: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#1B4332', // PRIMARY - Deep Forest
          950: '#0F2419',
        },

        // Background Colors - Cream
        cream: {
          DEFAULT: '#FAF9F6',
          50:  '#FFFFFF',
          100: '#FAF9F6', // Primary BG
          200: '#F5F5F0', // Secondary BG
          300: '#EBEBEB',
        },

        // Text Colors - Ink
        ink: {
          DEFAULT: '#1A1A1A', // Primary text
          light: '#6B6B6B',   // Secondary text
          muted: '#9CA3AF',   // Placeholder/disabled
        },

        // Semantic Colors
        success: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },

      // Glass effect utilities
      backdropBlur: {
        glass: '20px',
      },

      // Glass shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
      },

      // Typography
      fontFamily: {
        display: ['PlayfairDisplay', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
    },
  },
  plugins: [],
}
