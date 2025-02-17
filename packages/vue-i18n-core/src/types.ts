import type { ExportedGlobalComposer } from './i18n'

export type Disposer = () => void

/**
 *
 * The interface used for narrowing types using generated types.
 *
 * @remarks
 *
 * The type generated by 3rd party (e.g. nuxt/i18n)
 *
 * @example
 * ```ts
 * // generated-i18n-types.d.ts (`.d.ts` file at your app)
 *
 * declare module '@intlify/vue-i18n-core' {
 *   interface GeneratedTypeConfig {
 *   }
 * }
 * ```
 */

export interface GeneratedTypeConfig {}

/** @VueI18nGeneral */
export type VueI18nInstance = ExportedGlobalComposer
