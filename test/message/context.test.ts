import { compile } from '../../src/message/compiler'
import { createMessageContext } from '../../src/message/context'
import { isString } from '../../src/utils'

describe('text', () => {
  test('basic', () => {
    const msg = compile('hello world')
    const ctx = createMessageContext()
    expect(msg(ctx)).toMatch('hello world')
  })

  test('multline', () => {
    const msg = compile('hello\n world')
    const ctx = createMessageContext()
    expect(JSON.stringify(msg(ctx))).toMatch(`hello\\n world`)
  })
})

describe('list', () => {
  test('basic', () => {
    const msg = compile('hi {0} !')
    const ctx = createMessageContext({
      list: ['kazupon']
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('multiple', () => {
    const msg = compile('{0} {1} !')
    const ctx = createMessageContext({
      list: ['hi', 'kazupon']
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('nothing interpolation data', () => {
    const msg = compile('hi {0} !')
    const ctx = createMessageContext()
    expect(msg(ctx)).toMatch(`hi  !`)
  })
})

describe('named', () => {
  test('basic', () => {
    const msg = compile('hi {name} !')
    const ctx = createMessageContext({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('multiple', () => {
    const msg = compile('{greeting} {name} !')
    const ctx = createMessageContext({
      named: {
        greeting: 'hi',
        name: 'kazupon'
      }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('nothing interpolation data', () => {
    const msg = compile('hi {name} !')
    const ctx = createMessageContext()
    expect(msg(ctx)).toMatch(`hi  !`)
  })
})

describe('linked', () => {
  test('key', () => {
    const msg = compile('hi @:name !')
    const ctx = createMessageContext({
      messages: {
        name: ctx => 'kazupon' // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('list', () => {
    const msg = compile('hi @:{0} !')
    const ctx = createMessageContext({
      list: ['name'],
      messages: {
        name: ctx => 'kazupon' // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('named', () => {
    const msg = compile('hi @:{name} !')
    const ctx = createMessageContext({
      named: {
        name: 'nickname'
      },
      messages: {
        nickname: ctx => 'kazupon' // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('modifier', () => {
    const msg = compile(`hi @.upper:{'name'} !`)
    const ctx = createMessageContext({
      modifiers: {
        upper: (str: string): string => str.toUpperCase()
      },
      messages: {
        name: ctx => 'kazupon' // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatch(`hi KAZUPON !`)
  })

  test('no modifier', () => {
    const msg = compile(`hi @.upper:{'name'} !`)
    const ctx = createMessageContext({
      messages: {
        name: ctx => 'kazupon' // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('resolve from function', () => {
    const msg = compile('hi @:name !')
    const ctx = createMessageContext({
      messages: str => ctx => 'kazupon' // eslint-disable-line
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('reoslve from parent', () => {
    const parentMsg = compile('kazupon')
    const parent = createMessageContext({
      messages: {
        name: parentMsg
      }
    })
    const msg = compile('hi @:name !')
    const ctx = createMessageContext({
      parent
    })
    expect(msg(ctx)).toMatch(`hi kazupon !`)
  })

  test('not found message', () => {
    const msg = compile('hi @:{0} !')
    const ctx = createMessageContext({
      list: ['name'],
      messages: {}
    })
    expect(msg(ctx)).toMatch(`hi  !`)
  })
})

describe('plural', () => {
  test('basic', () => {
    const msg = compile('no apples | one apple  |  too much apples  ')
    const ctx0 = createMessageContext({ pluralIndex: 0 })
    const ctx1 = createMessageContext({ pluralIndex: 1 })
    const ctx2 = createMessageContext({ pluralIndex: 2 })
    expect(msg(ctx0)).toMatch(`no apples`)
    expect(msg(ctx1)).toMatch(`one apple`)
    expect(msg(ctx2)).toMatch(`too much apples`)
  })

  test('pre-defined', () => {
    const msg = compile('no apples | one apple | {count} apples')
    const ctxPreDefined = createMessageContext({ pluralIndex: 10 })
    const ctxNamed = createMessageContext({
      pluralIndex: 10,
      named: {
        count: 20
      }
    })
    expect(msg(ctxPreDefined)).toMatch(`10 apples`)
    expect(msg(ctxNamed)).toMatch(`20 apples`)
  })

  test('complex', () => {
    const msg = compile('no apples | {n} @.lower:{unit} | {n}　apples')
    const ctx = createMessageContext({
      modifiers: {
        lower: (str: string): string => str.toLowerCase()
      },
      named: {
        unit: 'apple',
        n: 1
      },
      messages: {
        'apple': ctx => 'APPLE' // eslint-disable-line
      },
      pluralIndex: 1
    })
    expect(msg(ctx)).toMatch(`1 apple`)
  })

  test('custom choice rule', () => {
    const pluralRules = {
      ru: (choice, choicesLength) => {
        if (choice === 0) {
          return 0
        }

        const teen = choice > 10 && choice < 20
        const endsWithOne = choice % 10 === 1
        if (!teen && endsWithOne) {
          return 1
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
          return 2
        }

        return choicesLength < 4 ? 2 : 3
      }
    }
    const msg = compile('0 машин | {n} машина | {n} машины | {n} машин')
    const ctx1 = createMessageContext({
      locale: 'ru',
      pluralIndex: 1,
      pluralRules
    })
    const ctx2 = createMessageContext({
      locale: 'ru',
      pluralIndex: 2,
      pluralRules
    })
    const ctx3 = createMessageContext({
      locale: 'ru',
      pluralIndex: 4,
      pluralRules
    })
    const ctx4 = createMessageContext({
      locale: 'ru',
      pluralIndex: 12,
      pluralRules
    })
    const ctx5 = createMessageContext({
      locale: 'ru',
      pluralIndex: 21,
      pluralRules
    })
    const ctx6 = createMessageContext({
      locale: 'ja',
      pluralIndex: 21,
      pluralRules
    })
    expect(msg(ctx1)).toMatch(`1 машина`)
    expect(msg(ctx2)).toMatch(`2 машины`)
    expect(msg(ctx3)).toMatch(`4 машины`)
    expect(msg(ctx4)).toMatch(`12 машин`)
    expect(msg(ctx5)).toMatch(`21 машина`)
    expect(msg(ctx6)).toMatch(`21 машин`)
  })
})

describe('custom process', () => {
  const createVNode = (text: string) => ({ text })
  const normalize = (values: unknown[]): unknown =>
    values.map(val => (isString(val) ? createVNode(val) : val))
  const interpolate = (val: unknown): unknown => val

  test('simple text', () => {
    const msg = compile('hello')
    const ctx = createMessageContext({
      processor: {
        normalize,
        interpolate
      }
    })
    expect(msg(ctx)).toMatchSnapshot()
  })

  test('list', () => {
    const msg = compile('hi, {0}!')
    const ctx = createMessageContext({
      list: [createVNode('kazupon')],
      processor: {
        normalize,
        interpolate
      }
    })
    expect(msg(ctx)).toMatchSnapshot()
  })

  test('named', () => {
    const msg = compile('hi {name} !')
    const ctx = createMessageContext({
      named: { name: createVNode('kazupon') },
      processor: {
        normalize,
        interpolate
      }
    })
    expect(msg(ctx)).toMatchSnapshot()
  })

  test('linked', () => {
    const msg = compile(`hi @.upper:{'name'} !`)
    const ctx = createMessageContext({
      processor: {
        normalize,
        interpolate,
        type: 'vnode'
      },
      modifiers: {
        upper: (val: unknown, type: string): unknown =>
          `${type}:${(val as { text: string }).text.toUpperCase()}`
      },
      messages: {
        name: ctx => createVNode('kazupon') // eslint-disable-line
      }
    })
    expect(msg(ctx)).toMatchSnapshot()
  })

  test('plural', () => {
    const msg = compile('no apples | {n} @.lower:{unit} | {n}　apples')
    const ctx = createMessageContext({
      processor: {
        normalize,
        interpolate,
        type: 'vnode'
      },
      modifiers: {
        lower: (val: unknown, type: string): unknown =>
          `${type}:${(val as { text: string }).text.toLowerCase()}`
      },
      named: {
        unit: 'apple',
        n: '1'
      },
      messages: {
        'apple': ctx => createVNode('APPLE') // eslint-disable-line
      },
      pluralIndex: 1
    })
    expect(msg(ctx)).toMatchSnapshot()
  })
})

describe('edge cases', () => {
  test(`text: '&nbsp;'`, () => {
    const msg = compile('&nbsp;')
    const ctx = createMessageContext()
    expect(msg(ctx)).toMatch(`&nbsp;`)
  })

  test(`plural: ' | foo | '`, () => {
    const msg = compile(` | foo | `, {
      onError(error) {
        expect({ ...error, message: error.message }).toMatchSnapshot('error')
      }
    })
    const ctx = createMessageContext()
    expect(msg(ctx)).toMatch('')
  })
})
