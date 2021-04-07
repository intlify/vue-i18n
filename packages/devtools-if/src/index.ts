import type { Emittable } from '@intlify/shared'

export interface IntlifyRecord {
  id: number
  i18n: unknown // TODO:
  version: string
  types: Record<string, string | Symbol> // TODO
}

export const enum IntlifyDevToolsHooks {
  I18N_INIT = 'i18n:init',
  FUNCTION_TRANSLATE = 'function:translate'
}

export type AdditionalPayloads = {
  meta?: Record<string, unknown>
}

export type IntlifyDevToolsHookPayloads = {
  [IntlifyDevToolsHooks.I18N_INIT]: {
    timestamp: number
    i18n: unknown // TODO:
    version: string
  } & AdditionalPayloads
  [IntlifyDevToolsHooks.FUNCTION_TRANSLATE]: {
    timestamp: number
    message: string | number
    key: string
    locale: string
    format?: string
  } & AdditionalPayloads
}

export type IntlifyDevToolsEmitterHooks = {
  [IntlifyDevToolsHooks.I18N_INIT]: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks.I18N_INIT]
  [IntlifyDevToolsHooks.FUNCTION_TRANSLATE]: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks.FUNCTION_TRANSLATE]
}

export type IntlifyDevToolsEmitter = Emittable<IntlifyDevToolsEmitterHooks>
