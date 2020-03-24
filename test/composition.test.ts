import { createI18nComposer, MissingHandler } from '../src/composition'
import { watch } from 'vue'

describe('locale', () => {
  it('default value', () => {
    const { locale } = createI18nComposer({})
    expect(locale.value).toEqual('en-US')
  })

  it('initialize at composer creating', () => {
    const { locale } = createI18nComposer({ locale: 'ja' })
    expect(locale.value).toEqual('ja')
  })

  it('reactivity', done => {
    const { locale } = createI18nComposer({})
    watch(locale, () => {
      expect(locale.value).toEqual('en')
      done()
    })
    locale.value = 'en'
  })
})

describe('fallbackLocales', () => {
  it('default value', () => {
    const { fallbackLocales } = createI18nComposer({})
    expect(fallbackLocales.value).toEqual([])
  })

  it('initialize at composer creating', () => {
    const { fallbackLocales } = createI18nComposer({ fallbackLocales: ['ja'] })
    expect(fallbackLocales.value).toEqual(['ja'])
  })
})

describe('messages', () => {
  it('default value', () => {
    const { messages } = createI18nComposer({})
    expect(messages.value).toEqual({
      'en-US': {}
    })
  })

  it('initialize at composer creating', () => {
    const { messages } = createI18nComposer({
      messages: {
        en: { hello: 'Hello,world!' },
        ja: {
          hello: 'こんにちは、世界！',
          nest: {
            foo: {
              bar: 'ばー'
            }
          }
        }
      }
    })
    expect(messages.value).toEqual({
      en: { hello: 'Hello,world!' },
      ja: {
        hello: 'こんにちは、世界！',
        nest: {
          foo: {
            bar: 'ばー'
          }
        }
      }
    })
  })
})

describe('modifiers', () => {
  it('default', () => {
    const { modifiers } = createI18nComposer({})
    expect(modifiers).toEqual({})
  })

  it('initialize at composer creating', () => {
    const _modifiers = {
      kebab: (str: string) => str.replace(/\s+/g, '-').toLowerCase()
    }
    const { modifiers, t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello world',
          hi: 'hi @.kebab:hello'
        }
      },
      modifiers: _modifiers
    })
    expect(modifiers).toEqual(_modifiers)
    expect(t('hi')).toEqual('hi hello-world')
  })
})

describe('missingWarn', () => {
  it('default', () => {
    const { missingWarn } = createI18nComposer({})
    expect(missingWarn).toEqual(true)
  })

  it('initialize at composer creating', () => {
    const { missingWarn } = createI18nComposer({ missingWarn: false })
    expect(missingWarn).toEqual(false)
  })
})

describe('fallbackWarn', () => {
  it('default: none fallbackLocales', () => {
    const { fallbackWarn } = createI18nComposer({})
    expect(fallbackWarn).toEqual(false)
  })

  it('default: have fallbackLocales', () => {
    const { fallbackWarn } = createI18nComposer({ fallbackLocales: ['ja'] })
    expect(fallbackWarn).toEqual(true)
  })

  it('initialize at composer creating', () => {
    const { fallbackWarn } = createI18nComposer({ fallbackWarn: /^hi.*!$/ })
    expect(fallbackWarn).toEqual(/^hi.*!$/)
  })
})

describe('getMissingHandler / setMissingHandler', () => {
  it('default', () => {
    const { getMissingHandler, setMissingHandler } = createI18nComposer({})
    expect(getMissingHandler()).toBeUndefined()

    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    setMissingHandler(missing as MissingHandler)
    expect(getMissingHandler()).toEqual(missing)
  })

  it('initialize at composer creating', () => {
    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    const { getMissingHandler } = createI18nComposer({ missing })
    expect(getMissingHandler()).toEqual(missing)
  })
})

describe('t', () => {
  it('basic', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(t('hi')).toEqual('hi kazupon !')
  })

  it('list', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(t('hi', { list: ['kazupon']})).toEqual('hi kazupon !')
  })

  it('named', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(t('hi', { named: { name: 'kazupon' } })).toEqual('hi kazupon !')
  })

  it('linked', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(t('hi')).toEqual('hi KAZUPON !')
  })

  it('plural', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(t('apple', { plural: 0 })).toEqual('no apples')
    expect(t('apple', { plural: 1 })).toEqual('one apple')
    expect(t('apple', { plural: 10 })).toEqual('10 apples')
    expect(t('apple', { plural: 10, named: { count: 20 } })).toEqual('20 apples')
  })
})
