/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        moustard: "#f7cf61",
        darkMoustard: "#dfb849",
        brightRed: "hsl(12, 88%, 59%)",
        brightRedLight: "hsl(12, 88%, 69%)",
        brightRedSupLight: "hsl(12, 88%, 95%)",
        darkBlue: "hsl(228, 39%, 23%)",
        darkGrayishBlue: "hsl(227, 12%, 61%)",
        veryDarkBlue: "hsl(233, 12%, 13%)",
        veryPaleRed: "hsl(13, 100%, 96%)",
        veryLightGray: "hsl(0, 0%, 98%)",
        gt: {
          // Abreviatura de Geartown
          moustard: {
            50: "#FFFBF2",
            100: "#FFF6E0",
            200: "#FFEDB8",
            300: "#FFE18E",
            400: "#FFD564",
            500: "#F7CF61",
            600: "#D9B14F",
            700: "#B88B3C",
            800: "#8C672C",
            900: "#614717",
          },
          yellow: {
            50: "#FFF9E1",
            100: "#FFF3BF",
            200: "#FFE58A",
            300: "#FFD54F",
            500: "#FFC107",
            700: "#FFA000",
            900: "#FF6F00",
          },
          dark: {
            100: "#E2E2E2",
            200: "#B7B7B7",
            300: "#8C8C8C",
            500: "#4A4A4A",
            600: "#3A3A3A",
            700: "#2A2A2A",
            800: "#222222",
            900: "#1A1A1A",
          },
          cream: {
            50: "#F7F4F0",
            200: "#EEE6DA",
            400: "#E5DDD1",
            500: "#DCC9B9",
            600: "#C7BAA7",
            700: "#B89988",
            800: "#A3907A",
          },
        },
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
