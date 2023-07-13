import { UserConfig, configDefaults } from 'vitest/config'
import config from './vitest.config'

export default {
  ...config,
  test: {
    ...config.test,
    environmentMatchGlobs: [['packages/vue-i18n-core/**', 'jsdom']],
    globalSetup: ['./scripts/vitest.unit.globalSetup.ts'],
    exclude: [...configDefaults.exclude, '**/e2e/**']
  }
} as UserConfig
