import type {
  IntlifyDevToolsHooks,
  IntlifyDevToolsHookPayloads,
  IntlifyDevToolsEmitter
} from '@intlify/devtools-types'

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
    devtools.emit('i18n:init', {
      timestamp: Date.now(),
      i18n,
      version,
      meta
    })
}

export const translateDevTools =
  /* #__PURE__*/ createDevToolsHook('function:translate')

function createDevToolsHook(hook: IntlifyDevToolsHooks) {
  return (payloads: IntlifyDevToolsHookPayloads[IntlifyDevToolsHooks]) =>
    devtools && devtools.emit(hook, payloads)
}
