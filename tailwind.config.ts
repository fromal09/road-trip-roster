import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F5EFE0',
        navy: '#1C2B4A',
        ember: '#D4621A',
        'ember-light': '#F2A073',
        forest: '#2A7A4B',
        danger: '#B93232',
        'text-warm': '#2C2218',
        'text-muted': '#7A6E62',
        'map-land': '#EAE4D5',
        'map-water': '#C9DCE8',
        'map-border': '#C0B09A',
      },
      fontFamily: {
        slab: ['var(--font-slab)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
        shake: 'shake 0.4s ease',
        'pulse-dot': 'pulseDot 1.5s ease infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
