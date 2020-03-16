import { createRuntimeContext as context, localize } from '../src/runtime'

describe('localize', () => {
  it('basic', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(localize(ctx, 'hi')).toEqual('hi kazupon !')
  })

  it('list', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(localize(ctx, 'hi', { list: ['kazupon']})).toEqual('hi kazupon !')
  })

  it('named', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(localize(ctx, 'hi', { named: { name: 'kazupon' } })).toEqual('hi kazupon !')
  })

  it('linked', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(localize(ctx, 'hi')).toEqual('hi KAZUPON !')
  })

  it('plural', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(localize(ctx, 'apple', { plural: 0 })).toEqual('no apples')
    expect(localize(ctx, 'apple', { plural: 1 })).toEqual('one apple')
    expect(localize(ctx, 'apple', { plural: 10 })).toEqual('10 apples')
    expect(localize(ctx, 'apple', { plural: 10, named: { count: 20 } })).toEqual('20 apples')
  })
})
