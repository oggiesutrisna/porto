/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'sans' : 'Lora',
    },
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
};
