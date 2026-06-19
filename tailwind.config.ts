import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0D0D0F',
          secondary: '#141418',
          tertiary: '#1C1C22',
        },
        accent: {
          DEFAULT: '#7B61FF',
          hover: '#9580FF',
          subtle: 'rgba(123,97,255,0.12)',
        },
        'text-primary': '#F0F0F5',
        'text-secondary': '#8A8A9A',
        'text-tertiary': '#55555F',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        btn: '8px',
      },
    },
  },
  plugins: [],
}

export default config
