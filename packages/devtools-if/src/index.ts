import type { Emittable } from '@intlify/shared'

export interface IntlifyRecord {
  id: number
  i18n: unknown // TODO:
  version: string
  types: Record<string, string | Symbol> // TODO
}

export const enum IntlifyDevToolsHooks {
  I18nInit = 'i18n:init',
  FunctionTranslate = 'function:translate'
}

export type AdditionalPayloads = {
  meta?: Record<string, unknown>
}

// export type IntlifyDevToolsHooks =
//   (typeof IntlifyDevToolsHooks)[keyof typeof IntlifyDevToolsHooks]

export type IntlifyDevToolsHookPayloads = {
  [IntlifyDevToolsHooks.I18nInit]: {
    timestamp: number
    i18n: unknown // TODO:
    version: string
  } & AdditionalPayloads
  [IntlifyDevToolsHooks.FunctionTranslate]: {
    timestamp: number
    message: string | number
    key: string
    locale: string
    format?: string
  } & AdditionalPayloads
}

export type IntlifyDevToolsEmitterHooks = {
  [IntlifyDevToolsHooks.I18nInit]: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks.I18nInit]
  [IntlifyDevToolsHooks.FunctionTranslate]: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks.FunctionTranslate]
}

export type IntlifyDevToolsEmitter = Emittable<IntlifyDevToolsEmitterHooks>
