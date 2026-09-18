/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["Quicksand", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      colors: {
        pinky: "#d94f8c",
        pinkdeep: "#9d174d",
        plum: "#7d5568",
      },
    },
  },
  plugins: [],
}
