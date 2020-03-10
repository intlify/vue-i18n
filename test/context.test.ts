import { compile } from '../src/message/compiler'
import { createMessageContext } from '../src/context'

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
    const msg = compile('hi @.upper:(name) !')
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
    const msg = compile('hi @.upper:(name) !')
    const ctx = createMessageContext({
      messages: {
        name: ctx => 'kazupon' // eslint-disable-line
      }
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
  test('simple', () => {
    const msg = compile('no apples | one apple  |  too much apples  ')
    const ctx = createMessageContext({
      pluralIndex: 1
    })
    expect(msg(ctx)).toMatch(`one apple`)
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
})
