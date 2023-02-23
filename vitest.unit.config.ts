import { UserConfig, configDefaults } from 'vitest/config'
import config from './vitest.config'

export default {
  ...config,
  test: {
    ...config.test,
    environmentMatchGlobs: [['packages/vue-i18n-core/**', 'jsdom']],
    exclude: [...configDefaults.exclude, '**/e2e/**']
  }
} as UserConfig
