import { getGlobalThis } from '@intlify/shared'
import {
  setDevToolsHook,
  compile,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue,
  registerLocaleFallbacker,
  fallbackWithLocaleChain
} from '@intlify/core-base'
import { initDev, initFeatureFlags } from '../../vue-i18n-core/src/misc'

if (__ESM_BUNDLER__ && !__TEST__) {
  initFeatureFlags()
}

// register message compiler for jit compilation
if (__FEATURE_JIT_COMPILATION__) {
  registerMessageCompiler(compile)
}

// register message resolver at vue-i18n
registerMessageResolver(resolveValue)

// register fallback locale at vue-i18n
registerLocaleFallbacker(fallbackWithLocaleChain)

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
  ComposerCustom,
  CustomBlock,
  CustomBlocks,
  ComposerTranslation,
  ComposerDateTimeFormatting,
  ComposerNumberFormatting,
  ComposerResolveLocaleMessageTranslation,
  RemovedIndexResources
} from '../../vue-i18n-core/src/composer'
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
  ComponentInstanceCreatedListener,
  VueI18nExtender
} from '../../vue-i18n-core/src/legacy'
export {
  createI18n,
  useI18n,
  castToVueI18n,
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
} from '../../vue-i18n-core/src/i18n'
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
} from '../../vue-i18n-core/src/components'
export {
  vTDirective,
  TranslationDirective
} from '../../vue-i18n-core/src/directive'
export { I18nPluginOptions } from '../../vue-i18n-core/src/plugin'
export { VERSION } from './../../vue-i18n-core/src/misc'
export { Disposer } from './../../vue-i18n-core/src/types'

export type {
  IsNever,
  IsEmptyObject,
  PickupPaths,
  PickupKeys,
  PickupFormatPathKeys
} from '@intlify/core-base'

// NOTE: experimental !!
if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
  const target = getGlobalThis()
  target.__INTLIFY__ = true
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)
}

if (__DEV__) {
  initDev()
}
