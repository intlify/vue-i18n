import type { DatetimeFormat, NumberFormat, Translation } from '@intlify/vue-i18n-core'
import type {
  ComponentCustomOptions as VueI18nComponentCustomOptions,
  ComponentCustomProperties as VueI18nComponentCustomProperties
} from './vue'

declare module 'vue' {
  export interface ComponentCustomOptions extends VueI18nComponentCustomOptions {}
  export interface ComponentCustomProperties extends VueI18nComponentCustomProperties {}
}

// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //

declare module 'vue' {
  export interface GlobalComponents {
    ['i18n-t']: typeof Translation
    ['i18n-d']: typeof DatetimeFormat
    ['i18n-n']: typeof NumberFormat
    ['I18nT']: typeof Translation
    ['I18nD']: typeof DatetimeFormat
    ['I18nN']: typeof NumberFormat
  }
}
