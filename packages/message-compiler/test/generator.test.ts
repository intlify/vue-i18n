/* eslint-disable no-irregular-whitespace */

import { createParser } from '../src/parser'
import { transform } from '../src/transformer'
import { generate } from '../src/generator'
import { SourceMapConsumer, RawSourceMap } from 'source-map'
import { CHAR_CR, CHAR_LF, CHAR_LS, CHAR_PS } from '../src/scanner'

interface Pos {
  line: number
  column: number
  name?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPositionInCode(
  code: string,
  token: string,
  expectName: string | boolean = false
): Pos {
  const generatedOffset = code.indexOf(token)
  // console.log('getPositionInCode', code, token, generatedOffset)
  const pos: Pos = {
    line: 1,
    column: generatedOffset
  }
  if (generatedOffset !== -1) {
    for (let i = generatedOffset; i < generatedOffset + token.length; i++) {
      if (
        (code[i] === CHAR_CR && code[i] === CHAR_LF) ||
        code[i] === CHAR_LF ||
        code[i] === CHAR_LS ||
        code[i] === CHAR_PS
      ) {
        pos.line++
        pos.column = 0
      } else {
        pos.column++
      }
    }
  }
  if (expectName) {
    pos.name = typeof expectName === 'string' ? expectName : token
  }
  // console.log('getPositionInCode ret', generatedOffset, pos)
  return pos
}

describe('text', () => {
  test('basic', async () => {
    const parser = createParser()
    const msg = 'hello world'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hello world"`)
    expect(code).toMatch(`])`)

    expect(map!.sources).toEqual([`message.intl`])
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('multline', async () => {
    const parser = createParser()
    const msg = 'hello\n world'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, {
      sourceMap: true,
      filename: 'foo.bar'
    })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hello\\n world"`)
    expect(code).toMatch(`])`)

    expect(map!.sources).toEqual([`foo.bar`])
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('list', () => {
  test('basic', async () => {
    const parser = createParser()
    const msg = 'hi {0} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _interpolate(_list(0)), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('multiple', async () => {
    const parser = createParser()
    const msg = '{0} {1} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(
      `_interpolate(_list(0)), " ", _interpolate(_list(1)), " !"`
    )
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('named', () => {
  test('basic', async () => {
    const parser = createParser()
    const msg = 'hi {name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _interpolate(_named("name")), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('multiple', async () => {
    const parser = createParser()
    const msg = '{greeting} {name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(
      `_interpolate(_named("greeting")), " ", _interpolate(_named("name")), " !"`
    )
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('literal', () => {
  test('ascii', async () => {
    const parser = createParser()
    const msg = `hi {'kazupon'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('multibytes', async () => {
    const parser = createParser()
    const msg = `hi {'かずぽん'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('emoji', async () => {
    const parser = createParser()
    const msg = `hi {'😺'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('{}', async () => {
    const parser = createParser()
    const msg = `{'{}'}`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('!#%^&*()-_+=[]:;?.<>"`', async () => {
    const parser = createParser()
    const msg = `hi {'${'!#%^&*()-_+=[]:;?.<>"`'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('escaped single quote', async () => {
    const parser = createParser()
    const msg = `hi {'\\''} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('escaped slash', async () => {
    const parser = createParser()
    const msg = `hi {'\\\\'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('unicode 4 digits', async () => {
    const parser = createParser()
    const msg = `hi {'${'\u0041'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('escaped unicode 4 digits', async () => {
    const parser = createParser()
    const msg = `hi {'\\\\u0041'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('unicode 6 digits', async () => {
    const parser = createParser()
    const msg = `hi {'${'U01F602'}'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('escaped unicode 6 digits', async () => {
    const parser = createParser()
    const msg = `hi {'\\\\U01F602'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('linked', () => {
  test('key', async () => {
    const parser = createParser()
    const msg = 'hi @:name !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _linked("name"), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('list', async () => {
    const parser = createParser()
    const msg = 'hi @:{0} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _linked(_interpolate(_list(0))), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('named', async () => {
    const parser = createParser()
    const msg = 'hi @:{name} !'
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _linked(_interpolate(_named("name"))), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('modifier', async () => {
    const parser = createParser()
    const msg = `hi @.upper:{'name'} !`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _normalize([`)
    expect(code).toMatch(`"hi ", _linked("name", "upper"), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('plural', () => {
  test('simple', async () => {
    const parser = createParser()
    const msg = 'no apples | one apple  |  too much apples  '
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _plural([`)
    expect(code).toMatch(`_normalize([`)
    expect(code).toMatch(`"no apples"`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`"one apple"`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`"too much apples  "`)
    expect(code).toMatch(` ])`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })

  test('complex', async () => {
    const parser = createParser()
    const msg = `@.caml:{'no apples'} | {0} apple | {n}　apples`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`return _plural([`)
    expect(code).toMatch(`_normalize([`)
    expect(code).toMatch(`_linked("no apples", "caml")`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`_interpolate(_list(0)), " apple"`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`_interpolate(_named("n")), "　apples"`)
    expect(code).toMatch(` ])`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

describe('arrow mode', () => {
  test('complex', async () => {
    const parser = createParser()
    const msg = `@.caml:{'no apples'} | {0} apple | {n}　apples`
    const ast = parser.parse(msg)
    transform(ast)
    const { code, map } = generate(ast, { sourceMap: true, mode: 'arrow' })

    expect(code).toMatchSnapshot(msg)
    expect(code).toMatch(`(ctx) => {`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot()
    })
  })
})

/* eslint-enable no-irregular-whitespace */
