import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Core brand
        navy: {
          DEFAULT: '#0C2448',
          deep: '#071A35',
        },
        gold: {
          DEFAULT: '#B88522',
          hover: '#9D7018',
          soft: '#E0C99A',
          surface: '#F7F0E2',
        },
        // Neutrals
        page: '#F7F9FC',
        admin: '#F5F7FA',
        surface: '#F1F4F8',
        line: {
          DEFAULT: '#D9E0EA',
          light: '#E8EDF3',
        },
        ink: {
          DEFAULT: '#10213D',
          soft: '#59677A',
          muted: '#7A8797',
        },
        // Status
        success: '#16845B',
        warning: '#C77912',
        danger: '#C63D45',
        info: '#2F6FBB',
        critical: '#9F1239',
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid headings: scale down on small viewports, hit the original
        // desktop size (max) on wide screens. lineHeight kept ~proportional.
        display: ['clamp(2.25rem, 1.35rem + 3.9vw, 3.5rem)', { lineHeight: '1.12', fontWeight: '700' }],
        h1: ['clamp(1.875rem, 1.45rem + 1.9vw, 2.875rem)', { lineHeight: '1.18', fontWeight: '700' }],
        h2: ['clamp(1.5rem, 1.18rem + 1.45vw, 2.25rem)', { lineHeight: '1.22', fontWeight: '700' }],
        h3: ['clamp(1.375rem, 1.2rem + 0.8vw, 1.625rem)', { lineHeight: '1.3', fontWeight: '650' }],
        h4: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '650' }],
        'body-lg': ['1.125rem', { lineHeight: '1.875rem' }],
        label: ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '650' }],
      },
      borderRadius: {
        input: '10px',
        card: '16px',
        form: '20px',
        panel: '24px',
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(12, 36, 72, 0.12)',
        form: '0 12px 40px -12px rgba(12, 36, 72, 0.22)',
        header: '0 2px 16px -8px rgba(12, 36, 72, 0.18)',
      },
      maxWidth: {
        content: '1360px',
        wide: '1500px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        28: '7rem',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
