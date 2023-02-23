import { UserConfig } from 'vitest/config'
import config from './vitest.config'

export default {
  ...config,
  test: {
    ...config.test,
    setupFiles: ['./scripts/vitest.setup.ts'],
    globalSetup: ['./scripts/vitest.globalSetup.ts'],
    include: ['./e2e/**/*.spec.ts']
  }
} as UserConfig
