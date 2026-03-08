/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extended Color Palette
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        dark: {
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
          950: '#020617',
        },
      },
      
      // Animation Extensions
      animation: {
        blob: 'blob 7s infinite',
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        shimmer: 'shimmer 1.5s infinite',
        spin: 'spin 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        aura: 'aura-pulse 3s ease-in-out infinite',
        'reveal-up': 'revealUp 0.6s cubic-bezier(0.5, 0, 0, 1) forwards',
        'reveal-left': 'revealLeft 0.6s cubic-bezier(0.5, 0, 0, 1) forwards',
        'reveal-right': 'revealRight 0.6s cubic-bezier(0.5, 0, 0, 1) forwards',
        'reveal-scale': 'revealScale 0.6s cubic-bezier(0.5, 0, 0, 1) forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'border-flow': 'borderFlow 3s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
        'gradient-flow': 'gradientFlow 4s ease infinite',
        'neon-flicker': 'neonFlicker 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'zoom-in': 'zoomIn 0.3s ease-out forwards',
        'bounce-slow': 'bounce 3s infinite',
      },
      
      // Keyframes Extensions
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-15px) rotate(2deg)' },
          '50%': { transform: 'translateY(-25px) rotate(0deg)' },
          '75%': { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5), 0 0 10px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.5)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        aura: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' },
        },
        revealUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        revealLeft: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        revealRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        revealScale: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: 0.5,
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          },
          '50%': { 
            opacity: 1,
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)'
          },
        },
        borderFlow: {
          '0%, 100%': { 
            borderColor: 'rgba(99, 102, 241, 0.3)',
          },
          '50%': { 
            borderColor: 'rgba(168, 85, 247, 0.6)',
          },
        },
        shine: {
          '0%': { 
            backgroundPosition: '-100% 0',
          },
          '100%': { 
            backgroundPosition: '200% 0',
          },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 10px rgba(99, 102, 241, 0.8), 0 0 20px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
          },
        },
        slideUp: {
          '0%': { 
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': { 
            opacity: 0,
            transform: 'translateY(-20px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        zoomIn: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0.9)',
          },
          '100%': { 
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      },
      
      // Background Image Extensions
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-radial-glow': 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
      },
      
      // Shadow Extensions
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
        'glow-xl': '0 0 60px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-orange': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.3)',
        'neon': '0 0 10px rgba(99, 102, 241, 0.8), 0 0 20px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)',
      },
      
      // Backdrop Blur Extensions
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
        '4xl': '80px',
      },
      
      // Border Radius Extensions
      borderRadius: {
        '4xl': '48px',
        '5xl': '64px',
      },
      
      // Spacing Extensions
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      
      // Font Family Extensions
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      // Font Size Extensions
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3.5rem', { lineHeight: '1' }],
        '6xl': ['4rem', { lineHeight: '1' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Opacity Extensions
      opacity: {
        '2.5': '0.025',
        '7.5': '0.075',
        '15': '0.15',
      },
      
      // Z-Index Extensions
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}

