/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Quicksand", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      colors: {
        cream: "#FFF5F9",
        ink: "#2B2135",
        pinky: "#D94F8C",
        pinkdeep: "#9D174D",
        plum: "#7D5568",
        lilac: "#B57BEE",
      },
      boxShadow: {
        card: "0 18px 50px -18px rgba(157,23,77,.28)",
        pop: "0 10px 30px -8px rgba(217,79,140,.5)",
      },
    },
  },
  plugins: [],
};
