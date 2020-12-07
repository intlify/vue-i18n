import type { Emittable } from './emittable'
import type { Path, PathValue } from '@intlify/message-resolver'
import type { Locale, RuntimeMissingType } from '../context'

export const enum DevToolsIDs {
  PLUGIN = 'vue-devtools-plugin-vue-i18n',
  CUSTOM_INSPECTOR = 'vue-i18n-resource-inspector',
  TIMELINE_COMPILE_ERROR = 'vue-i18n-compile-error',
  TIMELINE_MISSING = 'vue-i18n-missing',
  TIMELINE_FALLBACK = 'vue-i18n-fallback',
  TIMELINE_PERFORMANCE = 'vue-i18n-performance'
}

export const DevToolsLabels: Record<string, string> = {
  [DevToolsIDs.PLUGIN]: 'Vue I18n devtools',
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'I18n Resources',
  [DevToolsIDs.TIMELINE_COMPILE_ERROR]: 'Vue I18n: Compile Errors',
  [DevToolsIDs.TIMELINE_MISSING]: 'Vue I18n: Missing',
  [DevToolsIDs.TIMELINE_FALLBACK]: 'Vue I18n: Fallback',
  [DevToolsIDs.TIMELINE_PERFORMANCE]: 'Vue I18n: Performance'
}

export const DevToolsPlaceholders: Record<string, string> = {
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'Search for scopes ...'
}

export const DevToolsTimelineColors: Record<string, number> = {
  [DevToolsIDs.TIMELINE_COMPILE_ERROR]: 0xff0000,
  [DevToolsIDs.TIMELINE_MISSING]: 0xffcd19,
  [DevToolsIDs.TIMELINE_FALLBACK]: 0xffcd19,
  [DevToolsIDs.TIMELINE_PERFORMANCE]: 0xffcd19
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
  }
  [DevToolsTimelineEvents.MISSING]: {
    locale: Locale
    key: Path
    type: RuntimeMissingType
  }
  [DevToolsTimelineEvents.FALBACK]: {
    key: Path
    type: RuntimeMissingType
    from?: Locale
    to: Locale | 'global'
  }
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: {
    type: DevToolsTimelineEvents.MESSAGE_RESOLVE
    key: Path
    message: PathValue
    time: number
  }
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]: {
    type: DevToolsTimelineEvents.MESSAGE_COMPILATION
    message: PathValue
    time: number
  }
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: {
    type: DevToolsTimelineEvents.MESSAGE_EVALUATION
    value: unknown
    time: number
  }
}

export const DevToolsTimelineLayerMaps: Record<string, string> = {
  [DevToolsTimelineEvents.COMPILE_ERROR]: DevToolsIDs.TIMELINE_COMPILE_ERROR,
  [DevToolsTimelineEvents.MISSING]: DevToolsIDs.TIMELINE_MISSING,
  [DevToolsTimelineEvents.FALBACK]: DevToolsIDs.TIMELINE_FALLBACK,
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: DevToolsIDs.TIMELINE_PERFORMANCE,
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]:
    DevToolsIDs.TIMELINE_PERFORMANCE,
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: DevToolsIDs.TIMELINE_PERFORMANCE
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
