import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: ['scripts/*.ts'],
      project: '**/*.ts',
      ignore: ['e2e/**', 'examples/**', 'docs/**'],
      ignoreDependencies: [
        '@intlify/core-base',
        '@intlify/vue-i18n-core',
        '@vitest/coverage-v8',
        '@types/eslint',
        'oxc-parser',
        'tslib',
        'vitepress-plugin-llms'
      ]
    },
    'packages/core-base': {
      ignore: ['src/intl.ts', 'src/warnings.ts']
    },
    'packages/core': {
      ignore: ['src/runtime.ts'],
      ignoreDependencies: ['@intlify/shared']
    },
    'packages/message-compiler': {
      ignore: ['src/helpers.ts', 'src/generator.ts']
    },
    'packages/format-explorer': {
      ignore: ['src/utils.ts'],
      ignoreDependencies: ['@vue/compiler-sfc', 'vue-tsc']
    },
    'packages/vue-i18n-core': {
      ignore: ['src/**/*.ts', 'test/helper.ts'],
      ignoreDependencies: ['@vue/server-renderer']
    },
    'packages/petite-vue-i18n': {
      ignore: ['src/runtime.ts'],
      ignoreDependencies: ['@intlify/devtools-types', '@vue/devtools-api']
    },
    'packages/vue-i18n': {
      ignore: ['src/runtime.ts'],
      ignoreFiles: ['src/vue.d.ts', 'src/vue.ts'],
      ignoreDependencies: ['@vue/devtools-api', '@intlify/devtools-types']
    },
    'packages/size-check-core': {
      entry: ['src/**/*.ts', 'scripts/*.mjs']
    },
    'packages/size-check-vue-i18n': {
      entry: ['src/**/*.vue', 'src/**/*.ts', 'scripts/*.mjs'],
      ignoreDependencies: ['@vue/compiler-sfc']
    },
    'packages/size-check-petite-vue-i18n': {
      entry: ['src/**/*.vue', 'src/**/*.ts', 'scripts/*.mjs'],
      ignoreDependencies: ['petite-vue-i18n', '@vue/compiler-sfc']
    }
  },
  ignoreDependencies: ['lint-staged', 'mitata', '@kazupon/eslint-plugin']
}

export default config
