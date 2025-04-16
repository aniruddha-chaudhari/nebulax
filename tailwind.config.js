module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-dark': '#1f2560',
        'game-accent': '#f87b4a',
        'game-blue': '#5b9ddb',
        'game-yellow': '#f5f5fa',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'pixel-secondary': ['"Press Start 2P"', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        // other existing breakpoints
      },
    },
  },
  plugins: [],
}