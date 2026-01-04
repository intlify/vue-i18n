import type { InjectionKey } from 'vue'
import type { Composer } from './composer'
import type { I18n, I18nInternal } from './i18n'

declare module 'vue' {
  export interface App<HostElement = any> {
    __VUE_I18N__?: I18n & I18nInternal
    __VUE_I18N_SYMBOL__?: InjectionKey<I18n> | string
  }
}

// internal Component Instance API isCE
declare module 'vue' {
  export interface ComponentInternalInstance {
    /**
     * @internal
     * whether target component is custom element
     */
    isCE?: boolean
    /**
     * @internal
     * for vue/devtools i18n composer hook
     */
    __VUE_I18N__?: Composer
  }

  export interface GenericComponentInstance {
    /**
     * @internal
     * whether target component is custom element
     */
    isCE?: boolean
    /**
     * @internal
     * for vue/devtools i18n composer hook
     */
    __VUE_I18N__?: Composer
  }

  /**
   * `useInstanceOption` API does not still public API,
   * so we will define it as declaration module at vue-i18n
   */

  var internalOptions = ['ce', 'type', 'uid'] as const

  export declare function useInstanceOption<K extends (typeof internalOptions)[number]>(
    key: K,
    silent = false
  ): {
    hasInstance: boolean
    value: GenericComponentInstance[K] | undefined
  }
}
