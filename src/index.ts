export { Path, PathValue } from './path'
export { createParser, Parser } from './message/parser'
export { CompileOptions } from './message/options'
export { PluralizationRule, LinkedModifiers } from './message/context'
export {
  Locale,
  FallbackLocale,
  LocaleMessageDictionary,
  LocaleMessage,
  LocaleMessages,
  PostTranslationHandler
} from './runtime'
export * from './runtime/types'
export { MissingHandler, ComposerOptions, Composer } from './composer'
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
  VueI18n
} from './legacy'
export { createI18n, useI18n, I18nOptions } from './i18n'
export { I18nPluginOptions } from './plugin'
export const VERSION = __VERSION__
