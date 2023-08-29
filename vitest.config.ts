import { defineConfig, UserConfig } from 'vitest/config'
import pkg from './package.json'
import { entries } from './scripts/aliases'

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: JSON.stringify(pkg.version),
    __BROWSER__: false,
    __GLOBAL__: false,
    __RUNTIME__: false,
    __BUNDLE_FILENAME__: JSON.stringify('test.bundle.js'),
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: false,
    __NODE_JS__: true,
    __LITE__: false,
    __BRIDGE__: false,
    __FEATURE_FULL_INSTALL__: true,
    __FEATURE_LEGACY_API__: true,
    __FEATURE_JIT_COMPILATION__: true,
    __FEATURE_DROP_MESSAGE_COMPILER__: false
  },
  resolve: {
    alias: entries
  },
  test: {
    globals: true,
    // disable threads on GH actions to speed it up
    threads: !process.env.GITHUB_ACTIONS
  }
}) as UserConfig
