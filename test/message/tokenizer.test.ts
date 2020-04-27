import { parse } from '../../src/message/tokenizer'
import { TokenizeOptions } from '../../src/message/options'

test('token analysis', () => {
  ;[
    `hello world`,
    `hello\nworld`,
    `こんにちは、世界`,
    `😺`,
    ``,
    ` hello world `,
    `hi {name} !`,
    `{first} {middle}　{last}`, // eslint-disable-line no-irregular-whitespace
    `hi {  name } !`,
    `{first}\n{middle}\r\n{last}`,
    `hi {0} !`,
    `{0} {1}　{2}`, // eslint-disable-line no-irregular-whitespace
    `hi {  -1 } !`,
    `{0}\n{1}\r\n{2}`,
    `hi @:name !`,
    `hi @:{'hello world'} !`,
    `hi @:{name}\n !`,
    `hi @.upper:name !`,
    `hi @:{name} @:{0}!`,
    `no apples | one apple  |  too much apples `,
    `no apples |\n one apple  |\n  too much apples  `,
    `@.lower:{'no apples'} | {1} apple | {count}　apples`, // eslint-disable-line no-irregular-whitespace
    `hello\\nworld`,
    `hi, :-}`,
    `hi, :-)`,
    `hi {} !`,
    `hi {{}} !`,
    `hi {  } !`,
    `hi {\nname\n} !`,
    `hi {{name}} !`,
    `hi { { name } } !`,
    `hi {name !`,
    `hi { name !`,
    `hi {  name !`,
    `hi {{0}} !`,
    `hi { { 0 } } !`,
    `hi {0 !`,
    `hi {  0 !`,
    `hi {$} !`,
    `hi {-} !`,
    `hi {@.lower:name !`,
    `hi { @:name !`,
    `hi {  | hello {name} !`,
    `hi { @:name  | hello {name} !`,
    `hi { 'foo`,
    `hi { 'foo }`,
    `hi { 'foo\n' }`,
    `hi { '\\x41' }`,
    `hi { '\\uw' }`,
    `foo@bar.com`,
    `hi @:\nname !`,
    `hi @ :name !`,
    `hi @:{ name } !`,
    `hi @:{ {name} } !`,
    `hi @: {name} !`,
    `hi @. {name} !`,
    `hi @.upper {name} !`,
    `hi \n@\n.\nupper\n:\n{ name }\n !`,
    `hi @\n.\nupper\n:\n{'name'}\n !`,
    `hi @ .lower : {name} !`,
    `hi @:{ 'name' } !`,
    `hi @: {'name'} !`,
    `@.lower: {'no apples'} | {1 apple | @:{count　apples` // eslint-disable-line no-irregular-whitespace
  ].forEach(p => {
    const errors = []
    const options: TokenizeOptions = {
      onError: err => {
        errors.push({ ...err, message: err.message })
      }
    }
    const tokens = parse(p, options)
    expect(tokens).toMatchSnapshot(`${JSON.stringify(p)} tokens`)
    if (errors.length) {
      expect(errors).toMatchSnapshot(`${JSON.stringify(p)} errors`)
    }
  })
})
