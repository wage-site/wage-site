module.exports = {
  content: ["./src/**/*.{jsx,tsx,ts,js,html}", "./public/**/*.html"],
  theme: {
    extend: {
      screens: {
        short: { raw: "(max-height: 974px)" },
      },
      fontFamily: {
        custom: ["Lato", "Source Sans Pro", "sans-serif"],
      },
      boxShadow: {
        'sd-r': '10px 0 10px -7px #888',
      }
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
