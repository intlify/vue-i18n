import { parse } from '../../src/message/tokenizer'
import { TokenizeOptions } from '../../src/message/options'

test('token analysis', () => {
  ;[
    `hello world`,
    `hi {name} !`,
    `{first} {middle}　{last}`, // eslint-disable-line no-irregular-whitespace
    `hi {  name } !`,
    `{first}\n{middle}\r\n{last}`,
    `hi {0} !`,
    `{0} {1}　{2}`, // eslint-disable-line no-irregular-whitespace
    `hi {  -1 } !`,
    `{0}\n{1}\r\n{2}`,
    `hi {'kazupon'} !`,
    `hi @:name !`,
    `hi @:{'hello world'} !`,
    `hi @:{name}\n !`,
    `hi @.upper:name !`,
    `hi @:{name} @:{0}!`,
    `no apples | one apple  |  too much apples `,
    `no apples |\n one apple  |\n  too much apples  `,
    `@.lower:{'no apples'} | {1} apple | {count}　apples`, // eslint-disable-line no-irregular-whitespace
    `hello\nworld`,
    `こんにちは、世界`,
    `😺`,
    ``,
    `...`,
    `hypen-nate`,
    `hello:`,
    `1 + 1`,
    `name = foo`,
    `'single-quote'`,
    `"double-qoute"`,
    ` hello world `,
    `hello\\nworld`,
    `hi, :-) !`,
    `hi, :-} !`,
    `hi {} !`,
    `hi {{ !`,
    `hi {{}} !`,
    `hi {  } !`,
    `hi %name`,
    `hi {name$} !`,
    `hi {snake_case} !`,
    `hi {\nname\n} !`,
    `hi {{name}} !`,
    `hi { { name } } !`,
    `hi {name`,
    `hi {name !`,
    `hi { name !`,
    `hi {  name !`,
    `hi {{0}} !`,
    `hi { { 0 } } !`,
    `hi {0`,
    `hi {0 !`,
    `hi {  0 !`,
    `hi {@.lower:name !`,
    `hi { @:name !`,
    `hi {  | hello {name} !`,
    `hi { @:name  | hello {name} !`,
    `hi { 'foo`,
    `hi { 'foo }`,
    `hi { 'foo\n' }`,
    `hi { '\\x41' }`,
    `hi { '\\uw' }`,
    `hi {$} !`,
    `hi {-} !`,
    `hi @:{ name } !`,
    `hi @:{ 'name' } !`,
    `hi @:{ {name} } !`,
    `foo@bar.com`,
    `hi @\n:name !`,
    `hi @ :name !`,
    `hi @. {name} !`,
    `hi @.\n{name} !`,
    `hi @.upper\n{name} !`,
    `hi @.upper {name} !`,
    `hi @:\nname !`,
    `hi @: {'name'} !`,
    `hi @\n. upper\n:  {'name'}\n !`,
    ` | | |`,
    ` foo | | bar`,
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
