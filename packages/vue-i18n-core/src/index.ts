import { setDevToolsHook } from '@intlify/core-base'
import { getGlobalThis } from '@intlify/shared'
import { initDev, initFeatureFlags } from './misc'

export type {
  CompileError,
  DateTimeOptions,
  FallbackLocale,
  DateTimeFormat as IntlDateTimeFormat,
  DateTimeFormats as IntlDateTimeFormats,
  FormatMatcher as IntlFormatMatcher,
  LocaleMatcher as IntlLocaleMatcher,
  NumberFormat as IntlNumberFormat,
  NumberFormats as IntlNumberFormats,
  LinkedModifiers,
  Locale,
  LocaleMessage,
  LocaleMessageDictionary,
  LocaleMessages,
  LocaleMessageType,
  LocaleMessageValue,
  LocaleParams,
  MessageCompiler,
  MessageCompilerContext,
  MessageContext,
  MessageFunction,
  MessageFunctions,
  MessageResolver,
  NamedValue,
  NumberOptions,
  Path,
  PathValue,
  PluralizationRule,
  PostTranslationHandler,
  RemovedIndexResources,
  SchemaParams,
  TranslateOptions
} from '@intlify/core-base'
export type {
  BaseFormatProps,
  ComponentI18nScope,
  DatetimeFormat,
  DatetimeFormatProps,
  FormattableProps,
  I18nD,
  I18nN,
  I18nT,
  NumberFormat,
  NumberFormatProps,
  Translation,
  TranslationProps
} from './components'
export type {
  Composer,
  ComposerCustom,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerOptions,
  ComposerResolveLocaleMessageTranslation,
  ComposerTranslation,
  CustomBlock,
  CustomBlocks,
  DefaultDateTimeFormatSchema,
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  DefineDateTimeFormat,
  DefineLocaleMessage,
  DefineNumberFormat,
  MissingHandler,
  VueMessageType
} from './composer'
export { createI18n, I18nInjectionKey, useI18n } from './i18n'
export type {
  ComposerAdditionalOptions,
  ComposerExtender,
  ExportedGlobalComposer,
  I18n,
  I18nAdditionalOptions,
  I18nMode,
  I18nOptions,
  I18nScope,
  UseI18nOptions
} from './i18n'
export type {
  Choice,
  DateTimeFormatResult,
  LocaleMessageObject,
  NumberFormatResult,
  PluralizationRulesMap,
  TranslateResult,
  VueI18n,
  VueI18nDateTimeFormatting,
  VueI18nExtender,
  VueI18nNumberFormatting,
  VueI18nOptions,
  VueI18nResolveLocaleMessageTranslation,
  VueI18nTranslation,
  WarnHtmlInMessageLevel
} from './legacy'
export { initDev, initFeatureFlags, VERSION } from './misc'
export type { I18nPluginOptions } from './plugin'
export type { Disposer } from './types'

export type {
  IsEmptyObject,
  IsNever,
  PickupFormatPathKeys,
  PickupKeys,
  PickupPaths
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
