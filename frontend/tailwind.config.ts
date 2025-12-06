import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ChatGPT-inspired dark theme - pure darks
        background: '#0d0d0d',
        surface: '#171717',
        'surface-light': '#1e1e1e',
        'surface-lighter': '#2a2a2a',
        border: '#2f2f2f',
        'border-light': '#404040',
        
        // Primary accent - Clean teal/cyan
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#10b981',
          500: '#10a37f',  // ChatGPT green
          600: '#0d8a6f',
          700: '#0b7a5f',
          800: '#0a6b52',
          900: '#085c45',
        },
        
        // Secondary accent - Subtle gray-blue
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Status colors - Muted versions
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        
        // Text - High contrast on dark
        'text-primary': '#ececec',
        'text-secondary': '#a1a1a1',
        'text-muted': '#6b6b6b',
      },
      fontFamily: {
        sans: ['Söhne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Söhne Mono', 'Monaco', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(16, 163, 127, 0.1)',
        'glow-lg': '0 0 30px rgba(16, 163, 127, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
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
      },
    },
  },
  plugins: [],
}
export default config
