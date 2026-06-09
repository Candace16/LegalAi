/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          bg: '#0A0E1A',
          surface: '#111827',
          border: '#1F2937',
          accent: '#F59E0B',
          success: '#10B981',
          danger: '#EF4444',
          textMain: '#F9FAFB',
          textMuted: '#6B7280',
          glow: 'rgba(245,158,11,0.15)',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'float-med': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderGlow: {
          '0%': { borderColor: '#F59E0B', boxShadow: '0 0 10px rgba(245,158,11,0.2)' },
          '100%': { borderColor: '#10B981', boxShadow: '0 0 10px rgba(16,185,129,0.2)' },
        }
      }
    },
  },
  plugins: [],
}
