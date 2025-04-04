/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "#ff9d00",
      "primary-transparent": "#f3db7c3a",
      white: "#ffffff",
      black: "#000000",
      lightgray: "#ececec",
      lightgray2: "#fafafa",
      gray: "#cccccc",
      darkgray: "#4d4d4d",
      darkgray2: "#777777",
      darkgray3: "#080808",
      red: "#ff0000",
      green: "#008000",
      orange: "#ffa500",
      "white-transparent": "#4f4f4f8d",
      "black-transparent": "#0000008d",
    },
    screens: {
      desktop: { min: "1100px" },
      mobile: { max: "800px" },
    },
  },
  plugins: [],
};
