import js from '@eslint/js'
import pritter from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import ts from 'typescript-eslint'

export default [
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

  js.configs.recommended,

  //...ts.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        parser: ts.parser,
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-base-to-string': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ...ts.configs.disableTypeChecked
  },

  ...vue.configs['flat/recommended'],

  pritter,

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
      '@typescript-eslint/no-empty-object-type': 'off', // FIXME: enable this rule
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'vue/one-component-per-file': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/experimental-script-setup-vars': 'off',
      'vue/no-deprecated-props-default-this': 'off'
    }
  },

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
      '.eslintrc.cjs',
      'packages/*/index.js',
      'docsgen.config.js',
      'scripts/api/*.js'
    ]
  }
]
