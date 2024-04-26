import type { Emittable } from '@intlify/shared'
import type {
  Path,
  PathValue,
  Locale,
  MessageFunction,
  ResourceNode,
  CoreMissingType
} from '@intlify/core-base'

export interface IntlifyRecord {
  id: number
  i18n: unknown // TODO:
  version: string
  types: Record<string, string | Symbol> // TODO
}

export type IntlifyDevToolsHooks = 'i18n:init' | 'function:translate'

export type AdditionalPayloads = {
  meta?: Record<string, unknown>
}

export type IntlifyDevToolsHookPayloads = {
  'i18n:init': {
    timestamp: number
    i18n: unknown // TODO:
    version: string
  } & AdditionalPayloads
  'function:translate': {
    timestamp: number
    message: string | number
    key: string
    locale: string
    format?: string
  } & AdditionalPayloads
}

export type IntlifyDevToolsEmitterHooks = {
  'i18n:init': IntlifyDevToolsHookPayloads['i18n:init']
  'function:translate': IntlifyDevToolsHookPayloads['function:translate']
}

export type IntlifyDevToolsEmitter = Emittable<IntlifyDevToolsEmitterHooks>

export type VueDevToolsIDs =
  | 'vue-devtools-plugin-vue-i18n'
  | 'vue-i18n-resource-inspector'
  | 'vue-i18n-timeline'

export type VueDevToolsTimelineEvents =
  | 'compile-error'
  | 'missing'
  | 'fallback'
  | 'message-resolve'
  | 'message-compilation'
  | 'message-evaluation'

export type VueDevToolsTimelineEventPayloads = {
  'compile-error': {
    message: string
    error: string
    start?: number
    end?: number
    groupId?: string
  }
  missing: {
    locale: Locale
    key: Path
    type: CoreMissingType
    groupId?: string
  }
  fallback: {
    key: Path
    type: CoreMissingType
    from?: Locale
    to: Locale | 'global'
    groupId?: string
  }
  'message-resolve': {
    type: 'message-resolve'
    key: Path
    message: PathValue
    time: number
    groupId?: string
  }
  'message-compilation': {
    type: 'message-compilation'
    message: string | ResourceNode | MessageFunction
    time: number
    groupId?: string
  }
  'message-evaluation': {
    type: 'message-evaluation'
    value: unknown
    time: number
    groupId?: string
  }
}

export type VueDevToolsEmitterEvents = {
  'compile-error': VueDevToolsTimelineEventPayloads['compile-error']
  missing: VueDevToolsTimelineEventPayloads['missing']
  fallback: VueDevToolsTimelineEventPayloads['fallback']
  'message-resolve': VueDevToolsTimelineEventPayloads['message-resolve']
  'message-compilation': VueDevToolsTimelineEventPayloads['message-compilation']
  'message-evaluation': VueDevToolsTimelineEventPayloads['message-evaluation']
}

export type VueDevToolsEmitter = Emittable<VueDevToolsEmitterEvents>
