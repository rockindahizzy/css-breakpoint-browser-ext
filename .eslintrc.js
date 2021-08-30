module.exports = {
  root: true,

  env: {
    node: true,
    webextensions: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },


  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': "off",
    'no-restricted-globals': 'off',
    'import/extensions': 'off',
  },
  // settings: {
  //   "import/resolver": {
  //     alias: {
  //       map: ["src", "./src"]
  //     }
  //   }
  // }
};
