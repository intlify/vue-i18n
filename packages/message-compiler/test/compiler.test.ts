/* eslint-disable @typescript-eslint/no-empty-function, no-irregular-whitespace */

import { baseCompile as compile } from '../src/compiler'

test(`@.caml:{'no apples'} | {0} apple | {n}　apples`, () => {
  const { code, ast, map } = compile(
    `@.caml:{'no apples'} | {0} apple | {n}　apples`
  )
  expect(code).toMatchSnapshot('code')
  expect(ast).toMatchSnapshot('ast')
  expect(map).toMatchSnapshot('map')
})

describe('arrow mode', () => {
  test('hello world', () => {
    const { code } = compile(`hello world`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test('hello\\n world', () => {
    const { code } = compile(`hello\n world`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test('hi {0}!', () => {
    const { code } = compile(`hi {0}!`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test('hi {name}!', () => {
    const { code } = compile(`hi {name}!`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test("hi { 'kazupon' }!", () => {
    const { code } = compile(`hi { 'kazupon' }!`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test(`hi @.upper:{'name'} !`, () => {
    const { code } = compile(`hi @.upper:{'name'} !`, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test('!#%^&*()-_+=[]:;?.<>"`', () => {
    const { code } = compile(`hi {'${'!#%^&*()-_+=[]:;?.<>"`'}'} !`, {
      mode: 'arrow'
    })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test(` | | | `, () => {
    const { code } = compile(` | | | `, { mode: 'arrow' })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })

  test(`@.caml:{'no apples'} | {0} apple | {n}　apples`, () => {
    const { code } = compile(`@.caml:{'no apples'} | {0} apple | {n}　apples`, {
      mode: 'arrow'
    })
    new Function(code)
    expect(code).toMatchSnapshot('code')
  })
})

describe('edge cases', () => {
  test(` | | | `, () => {
    const { code } = compile(` | | | `, {
      onError(error) {
        expect({ ...error, message: error.message }).toMatchSnapshot('error')
      }
    })
    expect(code).toMatchSnapshot('code')
  })

  test(`hi %s !`, () => {
    const { code } = compile(`hi %s !`)
    expect(code).toMatchSnapshot('code')
  })

  test(`%`, () => {
    const { code } = compile(`%`)
    expect(code).toMatchSnapshot('code')
  })

  test(`no apples %| one apple % |  too much apples  `, () => {
    const { code } = compile(`no apples %| one apple % |  too much apples  `)
    expect(code).toMatchSnapshot('code')
  })

  test(`{_field} with the same value already exists.`, () => {
    const { code } = compile(`{_field} with the same value already exists.`)
    expect(code).toMatchSnapshot('code')
  })

  test(`hi @._upper:{_name} !`, () => {
    const { code } = compile(`hi @._upper:{_name} !`)
    expect(code).toMatchSnapshot('code')
  })
})
