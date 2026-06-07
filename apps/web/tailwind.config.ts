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
        iloilo: {
          red: '#C41E3A',
          gold: '#D4A017',
          blue: '#1B4F8A',
          cream: '#FAF3E0',
          brown: '#6B4423',
        }
      },
      fontFamily: {
        display: ['var(--font-playfair)'],
        body: ['var(--font-inter)'],
      }
    },
  },
  plugins: [],
}
export default config
