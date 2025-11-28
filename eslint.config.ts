import { includeIgnoreFile } from '@eslint/compat'
import {
  defineConfig,
  html,
  imports,
  javascript,
  jsonc,
  markdown,
  prettier,
  promise,
  regexp,
  stylistic,
  typescript,
  vue,
  yaml
} from '@kazupon/eslint-config'
import { globalIgnores } from 'eslint/config'
import { fileURLToPath, URL } from 'node:url'

import type { Linter } from 'eslint'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

const config: ReturnType<typeof defineConfig> = defineConfig(
  javascript({
    globals: {
      __DEV__: true,
      __COMMIT__: true
    }
  }),
  stylistic(),
  imports({
    typescript: true,
    rules: {
      'import/extensions': [
        'error',
        'always',
        { ts: 'never', js: 'never', mts: 'never', cts: 'never', mjs: 'never', cjs: 'never' }
      ]
    }
  }),
  promise(),
  regexp(),
  // unicorn({
  //   rules: {
  //     'unicorn/prevent-abbreviations': 'off',
  //     'unicorn/no-null': 'off',
  //   }
  // }),
  typescript({
    extraFileExtensions: ['vue'],
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname
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
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/only-throw-error': 'off'
    }
  }),
  vue({
    parserOptions: {
      tsconfigRootDir: import.meta.dirname
    },
    composable: true,
    typescript: true
  }),
  jsonc({
    json: true,
    json5: true,
    jsonc: true,
    prettier: true
  }),
  yaml({
    prettier: true
  }),
  html({
    prettier: true,
    rules: {
      '@html-eslint/require-lang': 'off'
    }
  }),
  markdown({
    preferences: false
  }),
  // vitest(),
  prettier(),
  includeIgnoreFile(gitignorePath),
  globalIgnores([
    '**/dist/**',
    '**/fixtures/**',
    '**/coverage/**',
    '**/.vitepress/**',
    '**/.vuepress/**',
    '**/test/**',
    '**/examples/**',
    'shim.d.ts',
    'temp/**',
    '.eslintcache',
    'packages/*/vite.config.ts',
    'packages/*/index.js',
    'packages/vue-i18n/src/vue.d.ts',
    'packages/vue-i18n-core/petite.js',
    'docsgen.config.js',
    'tsconfig.json',
    '**/api-extractor.json',
    'docs/api/**/*.md',
    '.github/FUNDING.yml',
    'CHANGELOG.md',
    'scripts/api/*.js'
  ]) as Linter.Config
)

export default config
