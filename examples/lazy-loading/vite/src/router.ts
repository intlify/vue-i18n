import { createRouter, createWebHistory } from 'vue-router'
import { setI18nLanguage, loadLocaleMessages } from './i18n'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { I18n, Locale, Composer } from 'vue-i18n'

import Home from './pages/Home.vue'
import About from './pages/About.vue'

export function setupRouter(i18n: I18n): Router {
  const SUPPORT_LOCALES = ['en', 'ja']
  const locale: Locale =
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
  router.beforeEach((to, from, next) => {
    const locale = (to.params as any).locale as Locale

    // check locale
    if (!SUPPORT_LOCALES.includes(locale)) {
      return false
    }

    // load locale messages
    loadLocaleMessages(i18n, locale)

    // set i18n language
    setI18nLanguage(i18n, locale)

    return next()
  })

  return router
}
