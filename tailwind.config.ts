import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'neon': '0 0 10px rgba(234,179,8,0.3), 0 0 20px rgba(234,179,8,0.1)',
        'neon-lg': '0 0 15px rgba(234,179,8,0.4), 0 0 30px rgba(234,179,8,0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config
