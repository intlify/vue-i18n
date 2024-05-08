/* eslint-disable @typescript-eslint/no-empty-function */

// directive
vitest.mock('../src/directive')

import { createApp } from 'vue'
import { I18n, I18nInternal } from '../src/i18n'
import { apply } from '../src/plugin/next'

describe('globalInstall option', () => {
  test('default', () => {
    const app = createApp({})
    const i18n = {} as I18n & I18nInternal
    const spy = vi.spyOn(app, 'component')

    apply(app, i18n)
    expect(spy).toHaveBeenCalled()
  })

  test('false', () => {
    const app = createApp({})
    const i18n = {} as I18n & I18nInternal
    const spy = vi.spyOn(app, 'component')

    apply(app, i18n, { globalInstall: false })
    expect(spy).not.toHaveBeenCalled()
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
