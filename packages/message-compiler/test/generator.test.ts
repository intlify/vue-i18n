/* eslint-disable no-irregular-whitespace */

import { format } from '@intlify/shared'
import { createParser } from '../src/parser'
import { transform } from '../src/transformer'
import { generate } from '../src/generator'
import { CHAR_CR, CHAR_LF, CHAR_LS, CHAR_PS } from '../src/scanner'
import { CompileErrorCodes, errorMessages } from '../src/errors'
import { SourceMapConsumer } from 'source-map-js'

import type { RawSourceMap } from 'source-map-js'
import type { ResourceNode } from '../src/nodes'

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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
    expect(code).toMatch(`"hi ", _linked("name", undefined, _type), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
    expect(code).toMatch(
      `"hi ", _linked(_interpolate(_list(0)), undefined, _type), " !"`
    )
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
    expect(code).toMatch(
      `"hi ", _linked(_interpolate(_named("name")), undefined, _type), " !"`
    )
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
    expect(code).toMatch(`"hi ", _linked("name", "upper", _type), " !"`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
    expect(code).toMatch(`_linked("no apples", "caml", _type)`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`_interpolate(_list(0)), " apple"`)
    expect(code).toMatch(` ]), _normalize([`)
    expect(code).toMatch(`_interpolate(_named("n")), "　apples"`)
    expect(code).toMatch(` ])`)
    expect(code).toMatch(`])`)

    expect(map!.sourcesContent).toEqual([msg])
    const consumer = await new SourceMapConsumer(map as RawSourceMap)
    consumer.eachMapping(mapping => {
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
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
      expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
    })
  })
})

test('disable source map with location: false', async () => {
  const parser = createParser({ location: false })
  const msg = 'hello world'
  const ast = parser.parse(msg)
  transform(ast)
  const { map } = generate(ast, { sourceMap: true, location: false })

  expect(map!.sourcesContent).toBeUndefined()
  const consumer = await new SourceMapConsumer(map as RawSourceMap)
  consumer.eachMapping(mapping => {
    expect(mapping).toMatchSnapshot(`${mapping.name} mapping`)
  })
})

test('unhandle error', () => {
  // wrong node type
  const type = 1024
  const ast = {
    type
  } as unknown as ResourceNode
  expect(() =>
    generate(ast, { sourceMap: true, location: false })
  ).toThrowError(
    format(errorMessages[CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE], type)
  )
})

/* eslint-enable no-irregular-whitespace */
