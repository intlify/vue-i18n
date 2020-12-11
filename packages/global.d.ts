// Global compile-time constants
declare let __DEV__: boolean
declare let __TEST__: boolean
declare let __BROWSER__: boolean
declare let __GLOBAL__: boolean
declare let __RUNTIME__: boolean
declare let __ESM_BUNDLER__: boolean
declare let __NODE_JS__: boolean
declare let __VERSION__: string
declare let __WARN_LABEL__: string
declare let __BUNDLE_FILENAME__: string
declare let __COMMIT__: string

// Feature flags
declare let __FEATURE_PROD_DEVTOOLS__: boolean
declare let __FEATURE_LEGACY_API__: boolean
declare let __FEATURE_FULL_INSTALL__: boolean

// for tests
declare namespace jest {
  interface Matchers<R> {
    toHaveBeenWarned(): R
    toHaveBeenWarnedLast(): R
    toHaveBeenWarnedTimes(n: number): R
  }
}
