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
