import type { Emittable } from './emittable'
import type { Path, PathValue } from '@intlify/message-resolver'
import type { Locale, CoreMissingType } from '../context'

export const enum DevToolsIDs {
  PLUGIN = 'vue-devtools-plugin-vue-i18n',
  CUSTOM_INSPECTOR = 'vue-i18n-resource-inspector',
  TIMELINE = 'vue-i18n-timeline'
}

export const DevToolsLabels: Record<string, string> = {
  [DevToolsIDs.PLUGIN]: 'Vue I18n devtools',
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'I18n Resources',
  [DevToolsIDs.TIMELINE]: 'Vue I18n'
}

export const DevToolsPlaceholders: Record<string, string> = {
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'Search for scopes ...'
}

export const DevToolsTimelineColors: Record<string, number> = {
  [DevToolsIDs.TIMELINE]: 0xffcd19
}

export const enum DevToolsTimelineEvents {
  COMPILE_ERROR = 'compile-error',
  MISSING = 'missing',
  FALBACK = 'fallback',
  MESSAGE_RESOLVE = 'message-resolve',
  MESSAGE_COMPILATION = 'message-compilation',
  MESSAGE_EVALUATION = 'message-evaluation'
}

export type DevToolsTimelineEventPayloads = {
  [DevToolsTimelineEvents.COMPILE_ERROR]: {
    message: PathValue
    error: string
    start?: number
    end?: number
    groupId?: string
  }
  [DevToolsTimelineEvents.MISSING]: {
    locale: Locale
    key: Path
    type: CoreMissingType
    groupId?: string
  }
  [DevToolsTimelineEvents.FALBACK]: {
    key: Path
    type: CoreMissingType
    from?: Locale
    to: Locale | 'global'
    groupId?: string
  }
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: {
    type: DevToolsTimelineEvents.MESSAGE_RESOLVE
    key: Path
    message: PathValue
    time: number
    groupId?: string
  }
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]: {
    type: DevToolsTimelineEvents.MESSAGE_COMPILATION
    message: PathValue
    time: number
    groupId?: string
  }
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: {
    type: DevToolsTimelineEvents.MESSAGE_EVALUATION
    value: unknown
    time: number
    groupId?: string
  }
}

export type DevToolsEmitterEvents = {
  [DevToolsTimelineEvents.COMPILE_ERROR]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.COMPILE_ERROR]
  [DevToolsTimelineEvents.MISSING]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MISSING]
  [DevToolsTimelineEvents.FALBACK]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.FALBACK]
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_RESOLVE]
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_COMPILATION]
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_EVALUATION]
}
export type DevToolsEmitter = Emittable<DevToolsEmitterEvents>
