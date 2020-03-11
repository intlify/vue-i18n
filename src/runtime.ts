import { Path } from './path'

export type Locale = string
export type LocaleMessageDictionary = {
  [property: string]: LocaleMessage
}
export type LocaleMessage =
  | string
  | LocaleMessageDictionary
  | LocaleMessage[]

export type LocaleMessages = Record<Locale, LocaleMessage>

export type TranslateResult =
  | string
  | null
  | LocaleMessageDictionary
  | LocaleMessage

export type DateTimeFormatResult = {
  // TODO:
}

export type NumberFormatResult = {
  // TODO:
}

// TODO: should implement more runtime !!
export type RuntimeOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
  // ...
}

// TODO: should implement more runtime !!
export type Runtime = {
  locale: Locale
  fallbackLocales: Locale[]
  // ...
  t: (key: Path, ...args: unknown[]) => unknown
  // ...
}

// vue-i18n new API with Runtime
export function createRuntime (options: RuntimeOptions = {}): Runtime {
  // ...

  const t = (key: Path, ...args: unknown[]): unknown => {
    // TOOD
    return key
  }

  // ...

  return {
    locale: options.locale || 'en',
    fallbackLocales: options.fallbackLocales || [],
    // ...
    t
    // ...
  }
}