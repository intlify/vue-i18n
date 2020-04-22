import { parse } from '../../src/message/tokenizer'

test('token analysis', () => {
  ;[
    'hello world',
    'hello\nworld',
    'こんにちは、世界',
    '😺',
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
    '@.lower:(no apples) | {1} apple | {count}　apples',
    // 'hello\\nworld', // text
    // 'hi, :-}', // text
    // `hi {} !`, // text
    // `hi {  } !`, // text
    // `hi {$} !`, // text
    // `hi {-} !` // text
    // `hi {{name}} !`,
    // `hi { { name } } !`, // named
    // `hi { name !`,
    // `hi {@:name !`, // text
    // `hi { @:name !`, // text
    // `hi {  | hello {name} !`, // text
    // `hi {{0}} !`, // list
    // `hi {{}} !`, // text
    // 'hi, :-)', // text
    // `hi {name !`, // named
    // `hi {  name !`, // named
    // `hi {0 !`, // list
    // `hi {  0 !`, // list
    // 'foo@bar.com', // text
    // 'hi @:{ name', // linked + named
  ].forEach(p => {
    expect(parse(p)).toMatchSnapshot(JSON.stringify(p))
  })
})
