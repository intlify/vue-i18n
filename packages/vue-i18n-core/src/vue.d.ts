import type { InjectionKey } from 'vue'
import type { I18n, I18nInternal } from './i18n'

declare module 'vue' {
  // eslint-disable-next-line
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
     * iskk custom element?
     */
    isCE?: boolean
  }
}
