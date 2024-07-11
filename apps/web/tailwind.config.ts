import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        'athens-gray': {
          '50': '#f6f8f9',
          '100': '#f0f2f4',
          '200': '#d6dce1',
          '300': '#b2bec7',
          '400': '#889ba8',
          '500': '#6a7e8d',
          '600': '#546775',
          '700': '#45535f',
          '800': '#3c4750',
          '900': '#353d45',
          '950': '#23292e',
        },
        gossamer: {
          '50': '#f2fbf8',
          '100': '#d4f3e8',
          '200': '#a9e6d2',
          '300': '#76d2b8',
          '400': '#4ab79c',
          '500': '#2f967e',
          '600': '#257c6a',
          '700': '#216457',
          '800': '#1e5147',
          '900': '#1d443c',
          '950': '#0c2724',
        },
        'blue-ribbon': {
          '50': '#eef8ff',
          '100': '#d8eeff',
          '200': '#bae0ff',
          '300': '#8bcfff',
          '400': '#54b3ff',
          '500': '#2d92ff',
          '600': '#116ffa',
          '700': '#0f5ae6',
          '800': '#1349ba',
          '900': '#164192',
          '950': '#122859',
        },
        supernova: {
          '50': '#fffee7',
          '100': '#fffec1',
          '200': '#fffa86',
          '300': '#ffee41',
          '400': '#ffde0d',
          '500': '#fece00',
          '600': '#d19700',
          '700': '#a66c02',
          '800': '#89540a',
          '900': '#74440f',
          '950': '#442304',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
