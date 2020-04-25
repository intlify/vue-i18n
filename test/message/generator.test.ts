import { createParser } from '../../src/message/parser'
import { transform } from '../../src/message/transformer'
import { generate } from '../../src/message/generator'

describe('text', () => {
  test('basic', () => {
    const parser = createParser()
    const msg = 'hello world'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(`"hello world"`)
    expect(code).toMatch(`])`)
  })

  test('multline', () => {
    const parser = createParser()
    const msg = 'hello\n world'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(`"hello\\n world"`)
    expect(code).toMatch(`])`)
  })
})

describe('list', () => {
  test('basic', () => {
    const parser = createParser()
    const msg = 'hi {0} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(`"hi ", ctx.interpolate(ctx.list(0)), " !"`)
    expect(code).toMatch(`])`)
  })

  test('multiple', () => {
    const parser = createParser()
    const msg = '{0} {1} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(
      `ctx.interpolate(ctx.list(0)), " ", ctx.interpolate(ctx.list(1)), " !"`
    )
    expect(code).toMatch(`])`)
  })
})

describe('named', () => {
  test('basic', () => {
    const parser = createParser()
    const msg = 'hi {name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(`"hi ", ctx.interpolate(ctx.named("name")), " !"`)
    expect(code).toMatch(`])`)
  })

  test('multiple', () => {
    const parser = createParser()
    const msg = '{greeting} {name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(
      `ctx.interpolate(ctx.named("greeting")), " ", ctx.interpolate(ctx.named("name")), " !"`
    )
    expect(code).toMatch(`])`)
  })
})

describe('literal', () => {
  test('ascii', () => {
    const parser = createParser()
    const msg = `hi {'kazupon'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('multibytes', () => {
    const parser = createParser()
    const msg = `hi {'かずぽん'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('emoji', () => {
    const parser = createParser()
    const msg = `hi {'😺'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('{}', () => {
    const parser = createParser()
    const msg = `{'{}'}`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('!#%^&*()-_+=[]:;?.<>"`', () => {
    const parser = createParser()
    const msg = `hi {'${'!#%^&*()-_+=[]:;?.<>"`'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('escaped single quote', () => {
    const parser = createParser()
    const msg = `hi {'\\''} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('escaped slash', () => {
    const parser = createParser()
    const msg = `hi {'\\\\'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('unicode 4 digits', () => {
    const parser = createParser()
    const msg = `hi {'${'\u0041'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('escaped unicode 4 digits', () => {
    const parser = createParser()
    const msg = `hi {'\\\\u0041'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('unicode 6 digits', () => {
    const parser = createParser()
    const msg = `hi {'${'U01F602'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })

  test('escaped unicode 6 digits', () => {
    const parser = createParser()
    const msg = `hi {'\\\\U01F602'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
  })
})

describe('linked', () => {
  test('key', () => {
    const parser = createParser()
    const msg = 'hi @:name !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(`"hi ", ctx.message("name")(ctx), " !"`)
    expect(code).toMatch(`])`)
  })

  test('list', () => {
    const parser = createParser()
    const msg = 'hi @:{0} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(
      `"hi ", ctx.message(ctx.interpolate(ctx.list(0)))(ctx), " !"`
    )
    expect(code).toMatch(`])`)
  })

  test('named', () => {
    const parser = createParser()
    const msg = 'hi @:{name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(
      `"hi ", ctx.message(ctx.interpolate(ctx.named("name")))(ctx), " !"`
    )
    expect(code).toMatch(`])`)
  })

  test('modifier', () => {
    const parser = createParser()
    const msg = `hi @.upper:{'name'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return ctx.normalize([`)
    expect(code).toMatch(
      `"hi ", ctx.modifier("upper")(ctx.message("name")(ctx), ctx.type), " !"`
    )
    expect(code).toMatch(`])`)
  })
})

describe('plural', () => {
  test('simple', () => {
    const parser = createParser()
    const msg = 'no apples | one apple  |  too much apples  '
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return [`)
    expect(code).toMatch(`ctx.normalize([`)
    expect(code).toMatch(`"no apples"`)
    expect(code).toMatch(` ]), ctx.normalize([`)
    expect(code).toMatch(`"one apple"`)
    expect(code).toMatch(` ]), ctx.normalize([`)
    expect(code).toMatch(`"too much apples  "`)
    expect(code).toMatch(` ])`)
    expect(code).toMatch(
      `][ctx.pluralRule(ctx.pluralIndex, 3, ctx.orgPluralRule)]`
    )
  })

  test('complex', () => {
    const parser = createParser()
    const msg = `@.caml:{'no apples'} | {0} apple | {n}　apples` // eslint-disable-line no-irregular-whitespace
    const ast = parser.parse(msg)
    transform(ast)
    const code = generate(ast)
    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return [`)
    expect(code).toMatch(`ctx.normalize([`)
    expect(code).toMatch(
      `ctx.modifier("caml")(ctx.message("no apples")(ctx), ctx.type)`
    )
    expect(code).toMatch(` ]), ctx.normalize([`)
    expect(code).toMatch(`ctx.interpolate(ctx.list(0)), " apple"`)
    expect(code).toMatch(` ]), ctx.normalize([`)
    expect(code).toMatch(`ctx.interpolate(ctx.named("n")), "　apples"`) // eslint-disable-line no-irregular-whitespace
    expect(code).toMatch(` ])`)
    expect(code).toMatch(
      `][ctx.pluralRule(ctx.pluralIndex, 3, ctx.orgPluralRule)]`
    )
  })
})
