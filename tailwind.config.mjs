/** @type {import('tailwindcss').Config} */

import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [typography],
}