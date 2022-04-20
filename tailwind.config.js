const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{jsx,tsx,ts,js,html}", "./index.html"],
  theme: {
    extend: {
      screens: {
        short: { raw: "(max-height: 974px)" },
      },
      fontFamily: {
        custom: ["Lato", "Source Sans Pro", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
