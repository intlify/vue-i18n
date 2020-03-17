import { createI18nComposer } from '../src/composition'
import { watch } from 'vue'

describe('locale', () => {
  it('computed prop', done => {
    const { locale } = createI18nComposer({})
    expect(locale.value).toEqual('en-US')

    watch(locale, () => {
      expect(locale.value).toEqual('en')
      done()
    })
    locale.value = 'en'
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
