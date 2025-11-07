/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: "#FFFDF2",
        secondary: "#000000",
      },
      textColor: {
        primary: "#FFFDF2",   // Blue
        secondary: "#000000", // Pink
        dark: "#1F2937",      // Dark gray
        light: "#F9FAFB",     // Light gray
      },
    },
  },
  plugins: [],
}

