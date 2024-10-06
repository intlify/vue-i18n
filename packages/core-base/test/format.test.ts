import { baseCompile as compile } from '@intlify/message-compiler'
import { format } from '../src/format'
import { createMessageContext as context } from '../src/runtime'

describe('features', () => {
  test('text: hello world', () => {
    const { ast } = compile('hello world', { jit: true })
    const msg = format(ast)
    const ctx = context()
    expect(msg(ctx)).toBe('hello world')
  })

  test('named: hello {name} !', () => {
    const { ast } = compile('hello {name} !', { jit: true })
    const msg = format(ast)
    const ctx = context({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toBe('hello kazupon !')
  })

  test('list: hello {0} !', () => {
    const { ast } = compile('hello {0} !', { jit: true })
    const msg = format(ast)
    const ctx = context({
      list: ['kazupon']
    })
    expect(msg(ctx)).toBe('hello kazupon !')
  })

  test("literal: hello {'kazupon'} !", () => {
    const { ast } = compile("hello {'kazupon'} !", { jit: true })
    const msg = format(ast)
    const ctx = context({})
    expect(msg(ctx)).toBe('hello kazupon !')
  })

  describe('linked', () => {
    test('key: hello @:name !', () => {
      const { ast } = compile('hello @:name !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        messages: {
          name: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('list: hello @:{0} !', () => {
      const { ast } = compile('hello @:{0} !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        list: ['kazupon'],
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('named: hello @:{name} !', () => {
      const { ast } = compile('hello @:{name} !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        named: { name: 'kazupon' },
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test("literal: hello @:{'kazupon'} !", () => {
      const { ast } = compile("hello @:{'kazupon'} !", { jit: true })
      const msg = format(ast)
      const ctx = context({
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello kazupon !')
    })

    test('modifier: hello @.upper:{name} !', () => {
      const { ast } = compile('hello @.upper:{name} !', { jit: true })
      const msg = format(ast)
      const ctx = context({
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        named: { name: 'kazupon' },
        messages: {
          kazupon: () => 'kazupon'
        }
      })
      expect(msg(ctx)).toBe('hello KAZUPON !')
    })
  })

  describe('plural', () => {
    test('simple: no apples | one apple | too much apples', () => {
      const { ast } = compile('no apples | one apple | too much apples', {
        jit: true
      })
      const msg = format(ast)
      const ctx = context({
        pluralIndex: 1
      })
      expect(msg(ctx)).toBe('one apple')
    })

    test(`@.upper:{'no apples'} | {0} apple | {n}　apples`, () => {
      const { ast } = compile(
        `@.upper:{'no apples'} | {0} apple | {n}　apples`,
        { jit: true }
      )
      const msg = format(ast)
      const ctx = context({
        pluralIndex: 2,
        modifiers: {
          upper: (val: string) => val.toUpperCase()
        },
        list: [1],
        named: {
          n: 3
        }
      })
      expect(msg(ctx)).toBe('3　apples')
    })
  })
})

describe('edge cases', () => {
  test('empty string in interpolation', () => {
    const { ast } = compile(`{''} | {n} test | {n} tests`, {
      jit: true
    })
    const msg = format(ast)
    const ctx = context({
      pluralIndex: 0
    })
    expect(msg(ctx)).toBe('')
  })
})
