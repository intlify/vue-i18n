/* eslint-disable @typescript-eslint/no-empty-function */

// directive
jest.mock('../src/directive')

// utils
jest.mock('@intlify/shared', () => ({
  ...jest.requireActual<object>('@intlify/shared'),
  warn: jest.fn()
}))
import { warn } from '@intlify/shared'

import { createApp } from 'vue'
import { I18n, I18nInternal } from '../src/i18n'
import { apply } from '../src/plugin/next'
import { getWarnMessage, I18nWarnCodes } from '../src/warnings'

describe('useI18nComponentName option', () => {
  test('default', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const app = createApp({})
    const i18n = {} as I18n & I18nInternal

    apply(app, i18n)
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('true', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})

    const app = createApp({})
    const i18n = {} as I18n & I18nInternal

    apply(app, i18n, { useI18nComponentName: true })
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0]).toEqual(
      getWarnMessage(I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE, {
        name: 'i18n-t'
      })
    )
  })
})

describe('globalInstall option', () => {
  test('default', () => {
    const app = createApp({})
    const i18n = {} as I18n & I18nInternal
    const spy = jest.spyOn(app, 'component')

    apply(app, i18n)
    expect(spy).toHaveBeenCalledTimes(3)
  })

  test('false', () => {
    const app = createApp({})
    const i18n = {} as I18n & I18nInternal
    const spy = jest.spyOn(app, 'component')

    apply(app, i18n, { globalInstall: false })
    expect(spy).not.toHaveBeenCalled()
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
