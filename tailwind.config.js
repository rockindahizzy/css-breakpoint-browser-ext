module.exports = {
  purge: {
    content: [
      './public/**/*.html',
      './src/**/*.vue',
      './src/directives/tooltip-directive.ts',
    ],
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
