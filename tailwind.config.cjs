/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)", 
        secondary: "rgb(var(--color-secondary) / <alpha-value>)", 
        "background-light": "rgb(var(--color-background-light) / <alpha-value>)", 
        "background-dark": "rgb(var(--color-background-dark) / <alpha-value>)", 
        "accent-tan": "rgb(var(--color-accent-tan) / <alpha-value>)",
        "accent-orange": "rgb(var(--color-accent-orange) / <alpha-value>)",
        "accent-red": "rgb(var(--color-accent-red) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
  darkMode: "class",
};
