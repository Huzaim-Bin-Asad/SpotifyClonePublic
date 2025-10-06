/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          bg: '#121212',
          card: '#181818',
          hover: '#2a2a2a',
          green: '#1db954',
          text: '#ffffff',
          textSecondary: '#b3b3b3',
        }
      },
      fontFamily: {
        'spotify': ['Circular', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
