import { getGlobalThis } from '@intlify/shared'
import { setDevToolsHook } from '@intlify/core-base'
import { initDev, initFeatureFlags } from './misc'

export {
  SchemaParams,
  LocaleParams,
  Path,
  PathValue,
  NamedValue,
  Locale,
  FallbackLocale,
  LocaleMessageValue,
  LocaleMessageDictionary,
  LocaleMessageType,
  LocaleMessages,
  LocaleMessage,
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
  PostTranslationHandler,
  MessageResolver,
  MessageCompiler,
  MessageCompilerContext,
  CompileError,
  MessageContext,
  RemovedIndexResources
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
  ComposerCustom,
  CustomBlock,
  CustomBlocks,
  ComposerTranslation,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerResolveLocaleMessageTranslation
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
  VueI18nExtender
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
  ExportedGlobalComposer,
  ComposerExtender
} from './i18n'
export {
  Translation,
  I18nT,
  NumberFormat,
  I18nN,
  DatetimeFormat,
  I18nD,
  TranslationProps,
  NumberFormatProps,
  DatetimeFormatProps,
  FormattableProps,
  BaseFormatProps,
  ComponentI18nScope
} from './components'
export {
  vTDirective,
  VTDirectiveValue,
  TranslationDirective
} from './directive'
export { I18nPluginOptions } from './plugin'
export { VERSION } from './misc'
export { Disposer } from './types'

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
