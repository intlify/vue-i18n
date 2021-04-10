import { IntlifyDevToolsHooks } from '@intlify/devtools-if'

import type {
  IntlifyDevToolsEmitter,
  IntlifyDevToolsHookPayloads
} from '@intlify/devtools-if'

let devtools: IntlifyDevToolsEmitter | null = null

export function setDevToolsHook(hook: IntlifyDevToolsEmitter | null): void {
  devtools = hook
}

export function getDevToolsHook(): IntlifyDevToolsEmitter | null {
  return devtools
}

export function initI18nDevTools(
  i18n: unknown,
  version: string,
  meta?: Record<string, unknown>
): void {
  // TODO: queue if devtools is undefined
  devtools &&
    devtools.emit(IntlifyDevToolsHooks.I18nInit, {
      timestamp: Date.now(),
      i18n,
      version,
      meta
    })
}

export const translateDevTools = /* #__PURE__*/ createDevToolsHook(
  IntlifyDevToolsHooks.FunctionTranslate
)

function createDevToolsHook(hook: IntlifyDevToolsHooks) {
  return (payloads: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks]) =>
    devtools && devtools.emit(hook, payloads)
}
