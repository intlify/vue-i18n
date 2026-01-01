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
}
