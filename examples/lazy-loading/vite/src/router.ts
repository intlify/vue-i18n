import { createRouter, createWebHistory } from 'vue-router'
import { setI18nLanguage, loadLocaleMessages, SUPPORT_LOCALES } from './i18n'

import type { Router, RouteRecordRaw } from 'vue-router'
import type { I18n, Composer } from 'vue-i18n'

import Home from './pages/Home.vue'
import About from './pages/About.vue'

export function setupRouter(i18n: I18n): Router {
  const locale: string =
    i18n.mode === 'legacy'
      ? i18n.global.locale
      : ((i18n.global as unknown) as Composer).locale.value

  // setup routes
  const routes: RouteRecordRaw[] = [
    {
      path: '/:locale/',
      name: 'home',
      component: Home
    },
    {
      path: '/:locale/about',
      name: 'about',
      component: About
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => `/${locale}`
    }
  ]

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  // navigation guards
  router.beforeEach(async (to, from, next) => {
    const paramsLocale = (to.params as any).locale as string

    // use locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return next(`/${locale}`)
    }

    // load locale messages
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale)
    }

    // set i18n language
    setI18nLanguage(i18n, paramsLocale)

    return next()
  })

  return router
}
