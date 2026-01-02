import {
  defineConfig,
  html,
  jsonc,
  markdown,
  regexp,
  typescript,
  vue,
  oxlint,
  yaml
} from '@kazupon/eslint-config'

const config: ReturnType<typeof defineConfig> = defineConfig(
  regexp(),
  typescript({
    extraFileExtensions: ['vue'],
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname
    },
    baseOnly: true
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
  oxlint({
    presets: ['typescript'],
    configFile: './.oxlintrc.json'
  }),
  {
    rules: {
      'vue/one-component-per-file': 'off'
    }
  }
)

export default config
