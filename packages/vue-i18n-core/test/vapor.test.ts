/**
 * @vitest-environment jsdom
 */

import {
  createVaporApp,
  defineVaporComponent,
  nextTick,
  renderEffect
} from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

test('uses the Composition API in a Vapor component', async () => {
  const container = document.createElement('div')
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: { hello: 'Hello from Vapor' },
      ja: { hello: 'Vaporからこんにちは' }
    }
  })
  const App = defineVaporComponent(() => {
    const { t } = useI18n()
    const element = document.createElement('p')

    renderEffect(() => {
      element.textContent = t('hello')
    })

    return element
  })
  const app = createVaporApp(App)

  app.use(i18n)
  app.mount(container)

  expect(container.innerHTML).toBe('<p>Hello from Vapor</p>')

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(container.innerHTML).toBe('<p>Vaporからこんにちは</p>')

  app.unmount()
})
