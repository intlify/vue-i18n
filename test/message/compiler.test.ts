import { compile } from '../../src/message/compiler'

test('compile', () => {
  const code = compile(
    `@.caml:{'no apples'} | {0} apple | {n}　apples` // eslint-disable-line no-irregular-whitespace
  )
  expect(code.toString()).toMatchSnapshot('code')
})
