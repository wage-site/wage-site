const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{jsx,tsx,ts,js,html}", "./index.html"],
  theme: {
    extend: {
      screens: {
        short: { raw: "(max-height: 974px)" },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
