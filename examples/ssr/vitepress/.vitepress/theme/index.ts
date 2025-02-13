import DefaultTheme from 'vitepress/theme'
import { createI18n } from 'vue-i18n'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello world!'
        }
      }
    })
    app.use(i18n)
    // ...
  }
}
