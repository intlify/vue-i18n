/* eslint-disable @typescript-eslint/no-empty-function */

// directive
vitest.mock('../src/directive')

import { createApp } from 'vue'
import { apply } from '../src/plugin/next'

describe('globalInstall option', () => {
  test('default', () => {
    const app = createApp({})
    const spy = vi.spyOn(app, 'component')

    apply(app)
    expect(spy).toHaveBeenCalled()
  })

  test('false', () => {
    const app = createApp({})
    const spy = vi.spyOn(app, 'component')

    apply(app, { globalInstall: false })
    expect(spy).not.toHaveBeenCalled()
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
