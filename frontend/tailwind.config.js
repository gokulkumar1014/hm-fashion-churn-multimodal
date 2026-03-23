/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hm-red': '#E50012',
        'hm-black': '#111111',
        'hm-white': '#FFFFFF',
        'hm-glass': 'rgba(255, 255, 255, 0.7)',
        'hm-light': '#F4F4F4',
        'hm-gray': '#767676',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Didot', 'serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
