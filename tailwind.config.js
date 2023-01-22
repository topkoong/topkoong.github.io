/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-blue': '#74ddd3',
        'bright-green': '#00ce7c',
        'pale-orange': '#ffa78d',
        'light-indigo': '#8191E6',
        'bright-yellow': '#FFDD00',
        'red-orange': '#FA4238',
        'darken-sky': '#007dc4',
        'darken-pink': '#f79ab9',
      },
      fontFamily: {
        apercu: ['Apercu', 'sans-serif'],
      },
      keyframes: {
        wave: {
          to: {
            'margin-left': '-51%',
          },
        },
        'spin-slow': {
          from: {
            transform: 'rotate(0deg) skew(0deg, -9deg)',
          },
          to: {
            transform: 'rotate(360deg) skew(9deg, 0deg)',
          },
        },
      },
      animation: {
        wave: 'wave 1.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 5s linear infinite alternate',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography')],
};
