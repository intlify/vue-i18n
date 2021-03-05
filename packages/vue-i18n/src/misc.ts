import { getGlobalThis } from '@intlify/shared'

/**
 * Vue I18n Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 *
 * @VueI18nGeneral
 */
export const VERSION = __VERSION__

/**
 * This is only called in esm-bundler builds.
 * istanbul-ignore-next
 */
export function initFeatureFlags(): void {
  let needWarn = false

  if (typeof __FEATURE_FULL_INSTALL__ !== 'boolean') {
    needWarn = true
    getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true
  }

  if (typeof __FEATURE_LEGACY_API__ !== 'boolean') {
    needWarn = true
    getGlobalThis().__VUE_I18N_LEGACY_API__ = true
  }

  if (typeof __FEATURE_PROD_DEVTOOLS__ !== 'boolean') {
    needWarn = true
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false
  }

  if (__DEV__ && typeof __FEATURE_ESM_BUNDLER_WARN__ === 'boolean') {
    needWarn = __FEATURE_ESM_BUNDLER_WARN__
  }

  if (__DEV__ && needWarn) {
    console.warn(
      `You are running the esm-bundler build of vue-i18n. It is recommended to ` +
        `configure your bundler to explicitly replace feature flag globals ` +
        `with boolean literals to get proper tree-shaking in the final bundle.`
    )
  }
}

/**
 * This is only called development env
 * istanbul-ignore-next
 */
export function initDev(): void {
  const target = getGlobalThis()

  target.__INTLIFY__ = true

  if (__BROWSER__) {
    console.info(
      `You are running a development build of vue-i18n.\n` +
        `Make sure to use the production build (*.prod.js) when deploying for production.`
    )
  }
}
