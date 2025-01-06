import { getGlobalThis } from '@intlify/shared'

/**
 * Vue I18n Version
 *
 * @remarks
 * Semver format. Same format as the package.json `version` field.
 *
 * @VueI18nGeneral
 */
export const VERSION: string = __VERSION__

/**
 * This is only called in esm-bundler builds.
 * istanbul-ignore-next
 *
 * @internal
 */
export function initFeatureFlags(): void {
  if (typeof __FEATURE_FULL_INSTALL__ !== 'boolean') {
    getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true
  }

  if (typeof __FEATURE_LEGACY_API__ !== 'boolean') {
    getGlobalThis().__VUE_I18N_LEGACY_API__ = true
  }

  if (typeof __FEATURE_DROP_MESSAGE_COMPILER__ !== 'boolean') {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false
  }

  if (typeof __FEATURE_PROD_INTLIFY_DEVTOOLS__ !== 'boolean') {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false
  }
}

/**
 * This is only called development env
 * istanbul-ignore-next
 *
 * @internal
 */
export function initDev(): void {
  if (__BROWSER__) {
    if (!__ESM_BUNDLER__) {
      console.info(
        `You are running a development build of vue-i18n.\n` +
          `Make sure to use the production build (*.prod.js) when deploying for production.`
      )
    }
  }
}
