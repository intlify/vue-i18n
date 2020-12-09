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
})
