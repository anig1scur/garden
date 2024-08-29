/** @type {import('tailwindcss').Config} */
module.exports = {
  mod: "jit",
  content: ["./index.html", "./src/**/*.{css,ts,tsx}"],
  darkMode: ['media', "class", "[data-theme='dark']"],
  theme: {
    extend: {
      backgroundImage: {
        'logo': "url('/assets/logo.svg')",
        'noise': "url('/assets/noise.gif')",
        'mirror': "url('/assets/bg.png')",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
