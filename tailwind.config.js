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
          DEFAULT: '#172033',
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
        secondary: '#64748B',
        background: '#F6F7FB',
        canvas: '#EEF2F7',
        paper: '#FFFFFF',
        ink: {
          muted: '#64748B',
          faint: '#94A3B8',
        },
        surface: {
          raised: '#F8FAFC',
          sunken: '#E8EDF5',
        },
        accent: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
          dark: '#1D4ED8',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
        brand: {
          sage: '#16A34A',
          blush: '#F97316',
          slate: '#475569',
          gold: '#D97706',
          lavender: '#7C3AED',
          cyan: '#0891B2',
          rose: '#E11D48',
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
        'xs': '0 1px 2px rgba(15,23,42,0.05)',
        'paper': '0 1px 2px rgba(15,23,42,0.06), 0 12px 30px rgba(15,23,42,0.08)',
        'paper-hover': '0 8px 18px rgba(15,23,42,0.08), 0 24px 50px rgba(15,23,42,0.12)',
        'sidebar': '8px 0 30px rgba(15,23,42,0.06)',
        'modal': '0 24px 80px rgba(15,23,42,0.22)',
        'card': '0 1px 2px rgba(15,23,42,0.05), 0 10px 28px rgba(15,23,42,0.07)',
        'card-hover': '0 10px 24px rgba(15,23,42,0.10), 0 28px 60px rgba(15,23,42,0.13)',
        'toolbar': '0 1px 0 rgba(148,163,184,0.35), 0 8px 24px rgba(15,23,42,0.04)',
        'float': '0 14px 42px rgba(15,23,42,0.18)',
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
