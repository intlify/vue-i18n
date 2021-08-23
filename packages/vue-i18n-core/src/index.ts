import { getGlobalThis } from '@intlify/shared'
import { setDevToolsHook } from '@intlify/core-base'
import { initDev, initFeatureFlags } from './misc'

export {
  Path,
  PathValue,
  NamedValue,
  Locale,
  FallbackLocale,
  LocaleMessageValue,
  LocaleMessageDictionary,
  LocaleMessageType,
  LocaleMessages,
  NumberFormat as IntlNumberFormat,
  DateTimeFormat as IntlDateTimeFormat,
  DateTimeFormats as IntlDateTimeFormats,
  NumberFormats as IntlNumberFormats,
  LocaleMatcher as IntlLocaleMatcher,
  FormatMatcher as IntlFormatMatcher,
  MessageFunction,
  MessageFunctions,
  PluralizationRule,
  LinkedModifiers,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  PostTranslationHandler
} from '@intlify/core-base'
export {
  VueMessageType,
  DefineLocaleMessage,
  DefaultLocaleMessageSchema,
  DefineDateTimeFormat,
  DefaultDateTimeFormatSchema,
  DefineNumberFormat,
  DefaultNumberFormatSchema,
  MissingHandler,
  ComposerOptions,
  Composer,
  CustomBlock,
  CustomBlocks,
  ComposerTranslation,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerResolveLocaleMessageTranslation,
  RemovedIndexResources
} from './composer'
export {
  TranslateResult,
  Choice,
  LocaleMessageObject,
  PluralizationRulesMap,
  WarnHtmlInMessageLevel,
  DateTimeFormatResult,
  NumberFormatResult,
  Formatter,
  VueI18nOptions,
  VueI18n,
  VueI18nTranslation,
  VueI18nTranslationChoice,
  VueI18nDateTimeFormatting,
  VueI18nNumberFormatting,
  VueI18nResolveLocaleMessageTranslation,
  ComponentInstanceCreatedListener
} from './legacy'
export {
  createI18n,
  useI18n,
  I18nInjectionKey,
  I18nOptions,
  I18nAdditionalOptions,
  I18n,
  I18nMode,
  I18nScope,
  ComposerAdditionalOptions,
  UseI18nOptions,
  ExportedGlobalComposer
} from './i18n'
export {
  Translation,
  NumberFormat,
  DatetimeFormat,
  TranslationProps,
  NumberFormatProps,
  DatetimeFormatProps,
  FormattableProps,
  BaseFormatProps,
  ComponetI18nScope
} from './components'
export { vTDirective, TranslationDirective } from './directive'
export { I18nPluginOptions } from './plugin'
export { VERSION } from './misc'

export type {
  IsNever,
  IsEmptyObject,
  PickupPaths,
  PickupKeys,
  PickupFormatPathKeys
} from '@intlify/core-base'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// NOTE: experimental !!
if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
  const target = getGlobalThis()
  target.__INTLIFY__ = true
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)
}

if (__DEV__) {
  initDev()
}
