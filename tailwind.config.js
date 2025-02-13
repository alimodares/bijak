/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 0 0 .2rem rgba(0, 123, 255, .25)',
      },
      fontFamily: {
        iranSans: ['IranSans', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}

