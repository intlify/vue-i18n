/**
 * @vitest-environment jsdom
 */

import {
  createVaporApp,
  defineVaporComponent,
  getCurrentInstance as getVueCurrentInstance,
  nextTick,
  renderEffect
} from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import { getCurrentInstance as getI18nCurrentInstance } from '../src/utils'

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
  let i18nInstance: ReturnType<typeof getI18nCurrentInstance> = null
  let vueInstance: ReturnType<typeof getVueCurrentInstance> = null
  const App = defineVaporComponent(() => {
    i18nInstance = getI18nCurrentInstance()
    vueInstance = getVueCurrentInstance()
    const { t } = useI18n({
      useScope: 'local',
      messages: {
        en: { hello: 'Hello from Vapor' },
        ja: { hello: 'Vaporからこんにちは' }
      }
    })
    const element = document.createElement('p')

    renderEffect(() => {
      element.textContent = t('hello')
    })

    return element
  })
  const app = createVaporApp(App)

  app.use(i18n)
  app.mount(container)

  expect(i18nInstance).not.toBeNull()
  expect(vueInstance).toBeNull()
  expect(getI18nCurrentInstance()).toBeNull()
  expect(container.innerHTML).toBe('<p>Hello from Vapor</p>')

  i18n.global.locale.value = 'ja'
  await nextTick()
  expect(container.innerHTML).toBe('<p>Vaporからこんにちは</p>')

  app.unmount()
  expect(getI18nCurrentInstance()).toBeNull()
})
