import globals from 'globals'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import ts from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

const vue = extendVuePlugin('plugin:vue/vue3-recommended', ts.parser)

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  // ignore globally
  {
    ignores: [
      '**/dist/**',
      '**/fixtures/**',
      '**/coverage/**',
      '**/.vitepress/**',
      '**/.vuepress/**',
      '**/test/**',
      '**/examples/**',
      'shim.d.ts',
      '.eslintcache',
      '.eslintrc.cjs'
    ]
  },

  js.configs.recommended,
  ...ts.configs.recommended,
  eslintConfigPrettier,
  ...vue,

  // globals
  {
    // files: ['**/*.js', '**/*.ts', '**/*.vue', '**/*.json'],
    languageOptions: {
      globals: {
        __DEV__: true,
        __COMMIT__: true,
        page: true,
        browser: true,
        context: true,
        ...globals.node
      },
      parserOptions: { sourceType: 'module' }
    }
  },

  // custom rules
  {
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
      'vue/multi-word-component-names': 'off',
      'vue/experimental-script-setup-vars': 'off',
      'vue/no-deprecated-props-default-this': 'off'
    }
  }
]

/**
 * extend eslint-plugin-vue with @typescript-eslint/parser
 * (NOTE: eslint-plugin-vue flat config WIP currently https://github.com/vuejs/eslint-plugin-vue/issues/1291)
 *
 * @param { 'plugin:vue/vue3-essential' | 'plugin:vue/vue3-strongly-recommended' | 'plugin:vue/vue3-recommended' } vueConfigPattern
 * @param { import("typescript-eslint").Config.parser } tsParser
 *
 * @return { import("eslint").Linter.FlatConfig[] }
 */
function extendVuePlugin(vueConfigPattern, tsParser) {
  const compat = new FlatCompat()
  const vuePlugin = compat.extends(vueConfigPattern)
  const vueLangOptions = vuePlugin[2]
  vueLangOptions.files = [
    '**/*.vue',
    '**/*.ts',
    '**/*.tsx',
    '**/*.mts',
    '**/*.cts'
  ]
  vueLangOptions.languageOptions = {
    // NOTE:
    //  https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
    parserOptions: {
      parser: tsParser
    },
    ecmaVersion: 'latest'
  }
  return vuePlugin
}
