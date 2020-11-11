import { createRouter, createWebHistory } from 'vue-router'
import { setI18nLanguage, loadLocaleMessages } from './i18n'

import Home from './pages/Home.vue'
import About from './pages/About.vue'

export function setupRouter(i18n) {
  const SUPPORT_LOCALES = ['en', 'ja']
  const locale =
    i18n.mode === 'legacy' ? i18n.global.locale : i18n.global.locale.value

  // setup routes
  const routes = [
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
    const locale = to.params.locale

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
