import { deepCopy } from '../src/index'

test('deepCopy merges without mutating src argument', () => {
  const msg1 = {
    hello: 'Greetings',
    about: {
      title: 'About us'
    },
    overwritten: 'Original text',
    fruit: [{ name: 'Apple' }]
  }
  const copy1 = structuredClone(msg1)

  const msg2 = {
    bye: 'Goodbye',
    about: {
      content: 'Some text'
    },
    overwritten: 'New text',
    fruit: [{ name: 'Strawberry' }],
    // @ts-ignore
    car: ({ plural }) => plural(['car', 'cars'])
  }

  const merged = {}

  deepCopy(msg1, merged)
  deepCopy(msg2, merged)

  expect(merged).toMatchInlineSnapshot(`
    {
      "about": {
        "content": "Some text",
        "title": "About us",
      },
      "bye": "Goodbye",
      "car": [Function],
      "fruit": [
        {
          "name": "Strawberry",
        },
      ],
      "hello": "Greetings",
      "overwritten": "New text",
    }
  `)

  // should not mutate source object
  expect(msg1).toStrictEqual(copy1)
})

test('deepCopy replaces arrays without retaining source references', () => {
  const source = {
    fruit: [{ name: 'Apple' }],
    nested: [['value']]
  }
  const destination = {
    fruit: [{ name: 'Strawberry' }, { name: 'Banana' }],
    nested: [['old']]
  }

  deepCopy(source, destination)

  expect(destination).toEqual(source)
  expect(destination.fruit).not.toBe(source.fruit)
  expect(destination.fruit[0]).not.toBe(source.fruit[0])
  expect(destination.nested).not.toBe(source.nested)
  expect(destination.nested[0]).not.toBe(source.nested[0])

  source.fruit[0].name = 'Pear'
  source.fruit.push({ name: 'Orange' })
  source.nested[0].push('new value')

  expect(destination).toEqual({
    fruit: [{ name: 'Apple' }],
    nested: [['value']]
  })
})

describe('CVE-2024-52810', () => {
  test('__proto__', () => {
    const source = '{ "__proto__": { "pollutedKey": 123 } }'
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    expect(dest).toEqual({})
    // @ts-ignore -- initialize polluted property
    expect(JSON.parse(JSON.stringify({}.__proto__))).toEqual({})
  })

  test('nest __proto__', () => {
    const source = '{ "foo": { "__proto__": { "pollutedKey": 123 } } }'
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    expect(dest).toEqual({ foo: {} })
    // @ts-ignore -- initialize polluted property
    expect(JSON.parse(JSON.stringify({}.__proto__))).toEqual({})
  })

  test('constructor prototype', () => {
    const source = '{ "constructor": { "prototype": { "polluted": 1 } } }'
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    // @ts-ignore -- initialize polluted property
    expect({}.polluted).toBeUndefined()
  })

  test('__proto__ nested in array', () => {
    const source = '{ "list": [{ "__proto__": { "pollutedKey": 123 } }] }'
    const dest = {}

    deepCopy(JSON.parse(source), dest)
    expect(dest).toEqual({ list: [{}] })
    // @ts-ignore -- initialize polluted property
    expect(JSON.parse(JSON.stringify({}.__proto__))).toEqual({})
  })
})
