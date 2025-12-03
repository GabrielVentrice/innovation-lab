import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // ExitLag Brand Colors
        brand: {
          DEFAULT: '#F0002B',
          red: '#F0002B',
        },
        primary: {
          DEFAULT: '#F0002B',
          50: '#FFE5EA',
          100: '#FFCCD5',
          200: '#FF99AB',
          300: '#FF6681',
          400: '#FF3357',
          500: '#F0002B',
          600: '#C00023',
          700: '#90001A',
          800: '#600012',
          900: '#300009',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          bg: '#1A1A1A',
          black: '#000000',
        },
        gray: {
          DEFAULT: '#656565',
          50: '#F7F7F7',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#656565',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
          950: '#000000',
        },
        light: {
          DEFAULT: '#F7F7F7',
          bg: '#F7F7F7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
} satisfies Config
