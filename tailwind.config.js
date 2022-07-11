/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'sans' : 'Fira Code',
    },
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
};
