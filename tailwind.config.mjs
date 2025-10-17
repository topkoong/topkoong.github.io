/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // Important: Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
