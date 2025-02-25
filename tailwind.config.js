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
        'custom-2' : 'inset 0 0 8px #555'
      },
      fontFamily: {
        YekanBakh: ['YekanBakh', 'sans-serif'], 
      },
      screens: {
        xs: "400px", 
        xxs:"320px"
      },
    },
  },
  plugins: [],
}

