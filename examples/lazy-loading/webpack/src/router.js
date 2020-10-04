import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import About from './pages/About.vue'

export function setupRouter(i18n) {
  const SUPPORT_LOCALES = ['en', 'ja']
  const { global: composer } = i18n

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
      redirect: () => `/${composer.locale.value}`
    }
  ]

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  // navigation guards
  router.beforeEach(async (to, from, next) => {
    const locale = to.params.locale

    // check locale
    if (!SUPPORT_LOCALES.includes(locale)) {
      return false
    }

    // load locale messages
    if (!composer.availableLocales.includes(locale)) {
      const messages = await import(
        /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
      )
      composer.setLocaleMessage(locale, messages.default)
    }

    // set locale of composer
    composer.locale.value = locale

    return next()
  })

  return router
}
