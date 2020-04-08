export const VERSION = __VERSION__
export { Path, PathValue } from './path'
export {
  Locale,
  LocaleMessageDictionary,
  LocaleMessage,
  LocaleMessages,
  PostTranslationHandler
} from './runtime'
export * from './runtime/types'
export {
  MissingHandler,
  ComposerOptions,
  Composer,
  createComposer
} from './composer'
export { useI18n } from './use'
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
  createI18n
} from './legacy'
