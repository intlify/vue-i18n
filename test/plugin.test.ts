/* eslint-disable @typescript-eslint/no-empty-function */

// directive
jest.mock('../src/directive')

// utils
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../src/utils'

import { createApp } from 'vue'
import { I18n, I18nInternal } from '../src/i18n'
import { apply } from '../src/plugin'

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
      `component name legacy compatible: 'i18n-t' -> 'i18n'`
    )
  })
})

/* eslint-enable @typescript-eslint/no-empty-function */
