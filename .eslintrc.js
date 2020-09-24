'use strict'

module.exports = {
  root: true,
  globals: {
    __DEV__: true,
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  },
  env: {
    node: true,
    jest: true
  },
  extends: [
    'plugin:vue-libs/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  plugins: ['@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  rules: {
    'object-curly-spacing': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'vue/one-component-per-file': 'off',
    'vue/experimental-script-setup-vars': 'off',
    'vue/no-deprecated-props-default-this': 'off'
  }
}
