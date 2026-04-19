import { createRouter, createWebHistory } from 'vue-router'
import { getLocale, loadLocaleMessages, setI18nLanguage, SUPPORT_LOCALES } from './i18n'

import type { I18n } from 'vue-i18n'
import type { Router, RouteRecordRaw } from 'vue-router'

import About from './pages/About.vue'
import Home from './pages/Home.vue'

export function setupRouter(i18n: I18n): Router {
  const locale = getLocale(i18n)

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
  router.beforeEach(async to => {
    const paramsLocale = to.params.locale as string

    // use locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return `/${locale}`
    }

    // load locale messages
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale)
    }

    // set i18n language
    setI18nLanguage(i18n, paramsLocale)
  })

  return router
}
