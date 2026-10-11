import { initFeatureFlags } from '../../core-base/src/misc'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

export * from '@intlify/core-base'
