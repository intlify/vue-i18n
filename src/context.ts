export type Locale = string

export type MessageContextOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
}

export type MessageContext = {
  locale: Locale
  fallbackLocales: Locale[]
}

export function createMessageContext (options: MessageContextOptions = {}): MessageContext {
  return {
    locale: options.locale || 'en',
    fallbackLocales: options.fallbackLocales || []
  }
}
