import { parse } from '../../src/message/tokenizer'

test('parse', () => {
  ;[
    'hello world',
    'hello\nworld',
    '',
    ' hello world ',
    'hi {name} !',
    '{first} {middle}　{last}',
    'hi {  name } !',
    '{first}\n{middle}\r\n{last}',
    'hi {0} !',
    '{0} {1}　{2}',
    'hi {  -1 } !',
    '{0}\n{1}\r\n{2}',
    'hi @:name !',
    'hi @:(hello world) !',
    'hi @:{name}\n !',
    'hi @.upper:name !',
    'hi @:{name} @:{0}!',
    'no apples | one apple  |  too much apples  ',
    'no apples |\n one apple  |\n  too much apples  ',
    '@.lower:(no apples) | {1} apple | {count}　apples'
  ].forEach(p => {
    expect(parse(p)).toMatchSnapshot(JSON.stringify(p))
  })
})
