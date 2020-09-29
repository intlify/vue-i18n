import { Emittable } from './emittable'
import { Path, PathValue } from '../path'
import { Locale, RuntimeMissingType } from '../core/context'

export const enum DevToolsIDs {
  PLUGIN = 'vue-devtools-plugin-vue-i18n',
  CUSTOM_INSPECTOR = 'vue-i18n-resource-inspector',
  TIMELINE_TRANSLATION_MISSING = 'vue-i18n-translation-missing',
  TIMELINE_FALLBACK_TRANSLATION = 'vue-i18n-fallback-translation',
  TIMELINE_PERFORMANCE = 'vue-i18n-performance'
}

export const DevToolsLabels: Record<string, string> = {
  [DevToolsIDs.PLUGIN]: 'Vue I18n devtools',
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'I18n Resources',
  [DevToolsIDs.TIMELINE_TRANSLATION_MISSING]: 'Vue I18n: Translation Missing',
  [DevToolsIDs.TIMELINE_FALLBACK_TRANSLATION]: 'Vue I18n: Fallback Translation',
  [DevToolsIDs.TIMELINE_PERFORMANCE]: 'Vue I18n: Performance'
}

export const DevToolsPlaceholders: Record<string, string> = {
  [DevToolsIDs.CUSTOM_INSPECTOR]: 'Search for scopes ...'
}

export const DevToolsTimelineColors: Record<string, number> = {
  [DevToolsIDs.TIMELINE_TRANSLATION_MISSING]: 0xffcd19,
  [DevToolsIDs.TIMELINE_FALLBACK_TRANSLATION]: 0xffcd19,
  [DevToolsIDs.TIMELINE_PERFORMANCE]: 0xffcd19
}

export const enum DevToolsTimelineEvents {
  TRANSLATION_MISSING = 'translation-missing',
  FALBACK_TRANSLATION = 'fallback-translation',
  MESSAGE_RESOLVE = 'message-resolve',
  MESSAGE_COMPILATION = 'message-compilation',
  MESSAGE_EVALUATION = 'message-evaluation'
}

export type DevToolsTimelineEventPayloads = {
  [DevToolsTimelineEvents.TRANSLATION_MISSING]: {
    locale: Locale
    key: Path
    type: RuntimeMissingType
  }
  [DevToolsTimelineEvents.FALBACK_TRANSLATION]: {
    key: Path
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
  [DevToolsTimelineEvents.TRANSLATION_MISSING]:
    DevToolsIDs.TIMELINE_TRANSLATION_MISSING,
  [DevToolsTimelineEvents.FALBACK_TRANSLATION]:
    DevToolsIDs.TIMELINE_FALLBACK_TRANSLATION,
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: DevToolsIDs.TIMELINE_PERFORMANCE,
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]:
    DevToolsIDs.TIMELINE_PERFORMANCE,
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: DevToolsIDs.TIMELINE_PERFORMANCE
}

export type DevToolsEmitterEvents = {
  [DevToolsTimelineEvents.TRANSLATION_MISSING]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.TRANSLATION_MISSING]
  [DevToolsTimelineEvents.FALBACK_TRANSLATION]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.FALBACK_TRANSLATION]
  [DevToolsTimelineEvents.MESSAGE_RESOLVE]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_RESOLVE]
  [DevToolsTimelineEvents.MESSAGE_COMPILATION]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_COMPILATION]
  [DevToolsTimelineEvents.MESSAGE_EVALUATION]: DevToolsTimelineEventPayloads[DevToolsTimelineEvents.MESSAGE_EVALUATION]
}
export type DevToolsEmitter = Emittable<DevToolsEmitterEvents>
