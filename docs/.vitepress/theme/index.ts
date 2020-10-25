import DefaultTheme from 'vitepress/dist/client/theme-default'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    console.log('ehchangeApp', app, router, siteData)
    // test
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
}
