import { createI18n } from '../src/i18n'

describe('createI18n', () => {
  test('legay mode', () => {
    const i18n = createI18n({
      legacy: true
    })

    expect(i18n.mode).toEqual('legacy')
  })

  test('composable mode', () => {
    const i18n = createI18n({})

    expect(i18n.mode).toEqual('composable')
  })
})

describe('useI18n', () => {
  test.todo('basic')
  test.todo('global scope')
  test.todo('parent scope')
  test.todo('not plugin installed')
  test.todo('not used in setup function')
})
