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
          DEFAULT: '#1E3A5F',
          50: '#E8EDF3',
          100: '#D1DBE7',
          200: '#A3B7CF',
          300: '#7593B7',
          400: '#476F9F',
          500: '#1E3A5F',
          600: '#182E4C',
          700: '#122239',
          800: '#0C1726',
          900: '#060B13',
        },
        accent: {
          DEFAULT: '#00D4AA',
          50: '#E6FAF7',
          100: '#CCF5EF',
          200: '#99EBDD',
          300: '#66E1CB',
          400: '#33D7B9',
          500: '#00D4AA',
          600: '#00A888',
          700: '#007C66',
          800: '#005044',
          900: '#002422',
        },
        warning: {
          DEFAULT: '#FF8C42',
          50: '#FFF3EC',
          100: '#FFE7D9',
          200: '#FFCEB3',
          300: '#FFB58D',
          400: '#FF9C67',
          500: '#FF8C42',
          600: '#CC702E',
          700: '#99541F',
          800: '#663810',
          900: '#331C08',
        },
        dark: {
          DEFAULT: '#0F1419',
          50: '#F5F7FA',
          100: '#E8ECF1',
          200: '#D1D9E3',
          300: '#BAC6D5',
          400: '#A3B3C7',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#0F1419',
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'input': '6px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(30, 58, 95, 0.12)',
        'card-hover': '0 8px 32px rgba(30, 58, 95, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'stagger': 'stagger 100ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
