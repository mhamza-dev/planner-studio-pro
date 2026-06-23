/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        secondary: '#6B7280',
        background: '#F8F6F2',
        canvas: '#F4F4F5',
        paper: '#FFFFFF',
        ink: {
          muted: '#71717A',
          faint: '#A1A1AA',
        },
        surface: {
          raised: '#FAFAFA',
          sunken: '#F4F4F5',
        },
        accent: {
          DEFAULT: '#D6CFC7',
          light: '#EDE9E4',
          dark: '#B8AFA5',
        },
        border: {
          DEFAULT: '#E7E5E4',
          strong: '#D4D4D8',
        },
        brand: {
          sage: '#8B9D77',
          blush: '#E8C4B8',
          slate: '#8395A7',
          gold: '#C9A96E',
          lavender: '#9B8EC4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'paper': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
        'paper-hover': '0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.12)',
        'sidebar': '2px 0 20px rgba(0,0,0,0.06)',
        'modal': '0 20px 60px rgba(0,0,0,0.15)',
        'card': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10)',
        'toolbar': '0 1px 0 rgba(0,0,0,0.06)',
        'float': '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
  },
  plugins: [],
}
