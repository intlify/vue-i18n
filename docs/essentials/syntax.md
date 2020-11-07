# Message Format Syntax

Vue I18n can use message format syntax to localize the messages to be displayed in the UI. Vue I18n messages are interpolations and messages with various feature syntax.

Under the hood, The messages written in message format syntax are compiled into message functions with Vue I18n message compiler. Message functions and caching mechanism to maximize performance gains.

If you prefer the raw power of JavaScript, you can also [directly write message functions](../advanced/function) instead of messages.

## Interpolations

Vue I18n supports interpolation using placeholders `{}` like "Mustache".

### Named interpolation

The Named interpolation can be interpolated in the placeholder using variable names defined in JavaScript.

As an example, the following locale messages resource:

```js
const messages = {
  en: {
    message: {
      hello: '{msg} world'
    }
  }
}
```

The locale messages is the resource specified by the `messages` option of `createI18n` function. It is defined `en` locale with `{ message: { hello: '{msg} world' } } }`.

Named interpolation allows you to specify variables defined in JavaScript. In the locale message above, you can localize it by giving the JavaScript defined `msg` as a parameter to the translation function.

The following is an example of the use of `$t` in a template:

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

The first argument is `message.hello` as the locale messages key, and the second argument is an object with `msg` property as a parameter to `$t` function.

:::tip NOTE
The locale message resource key for the translate function can be specified for a specific resource namespace with using `.` (dot), just like a JavaScript object.
::::

:::tip NOTE
`$t` function has some overloads. About these overloads, see the here.
:::

As result the below:

```html
<p>hello world</p>
```

### List interpolation

The List interpolation can be interpolated in the placeholder using an array defined in JavaScript.

As an example, the following locale messages resource:

```js
const messages = {
  en: {
    message: {
      hello: '{0} world'
    }
  }
}
```

It is defined `en` locale with `{ message: { hello: '{0} world' } } }`.

List interpolation allows you to specify array defined in JavaScript. In the locale message above, you can be localized by giving the `0` index item of the array defined by JavaScript as a parameter to the translation function.

The following is an example of the use of `$t` in a template:

```html
<p>{{ $t('message.hello', ['hello']) }}</p>
```

The first argument is `message.hello` as the locale messages key, and the second argument is an array that have `'hello'` item as a parameter to `$t` function.

As result the below:

```html
<p>hello world</p>
```

### Literal interpolation

The Literal interpolation can be interpolated in the placeholder using literal string.

As an example, the following locale messages resource:

```js
const messages = {
  en: {
    address: "{account}{'@'}{domain}"
  }
}
```

It is defined `en` locale with `{ address: "{account}{'@'}{domain} }`.

Literal interpolation allows you to specify string literal that is quoted with single quotation `’`. The message specified with literal interpolation is localized **as the string** by the translation function.

The following is an example of the use of `$t` in a template:

```html
<p>email: {{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
```

The first argument is `address` as the locale messages key, and the second argument is an object with `account` and `domain` property as a parameter to `$t` function.

As result the below:

```html
<p>email: foo@domain.com</p>
```

:::tip NOTE
Literal interpolation is useful for special characters in message format syntax, such as `{` and `}`, which cannot be used directly in the message.
:::

## Linked messages

If there’s a locale messages key that will always have the same concrete text as another one you can just link to it.

To link to another locale messages key, all you have to do is to prefix its contents with an *`@:key`* sign followed by the full name of the locale messages key including the namespace you want to link to.

Locale messages the below:

```js
const messages = {
  en: {
    message: {
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:message.dio @:message.the_world !!!!'
    }
  }
}
```

It’s `en` locale that has hierarchical structure in the object.

The `message.the_world` has `the world` and `message.dio`. The `message.linked` has `@:message.dio @:message.dio @:message.the_world !!!!`, and it’s linked to the locale messages key with `message.dio` and `message.the_world`.

The following is an example of the use of `$t` in a template:

```html
<p>{{ $t('message.linked') }}</p>
```

The first argument is `message.linked` as the locale messages key as a parameter to `$t` function.

As result the below:

```html
<p>DIO: the world !!!!</p>
```

### Built-in Modifiers

If the language distinguish cases of character, you may need control the case of the linked locale messages.
Linked messages can be formatted with modifier *`@.modifier:key`*

The below modifiers are built-in available currently.

* `upper`: Uppercase all characters in the linked message
* `lower`: Lowercase all characters in the linked message
* `capitalize`: Capitalize the first character in the linked message

Locale messages the below:

```js
const messages = {
  en: {
    message: {
      homeAddress: 'Home address',
      missingHomeAddress: 'Please provide @.lower:message.homeAddress'
    }
  }
}
```

It’s `en` locale that has hierarchical structure in the object.

The `message.homeAddress` has `Home address`. The `message.missingHomeAddress` has `Please provide @.lower:message.homeAddress`, and it’s linked to the locale messages key with `message.homeAddress`.

Since the modifier `.lower` is specified in the above example, so the linked `message.homeAddress` key is resolved, after that is evaluated it.

The following is an example of the use of `$t` in a template:

```html
<label>{{ $t('message.homeAddress') }}</label>
<p class="error">{{ $t('message.missingHomeAddress') }}</p>
```

As result the below:

```html
<label>Home address</label>
<p class="error">Please provide home address</p>
```

### Custom Modifiers

If you want to use a non built-in modifiers, you can use your custom modifiers.

To use custom modifiers, you must specify them in `modifiers` option of `createI18n` function:

```js
const i18n = createI18n({
  locale: 'en',
  messages: {
    // set somethinig locale messages ...
  },
  // set custom modifiers at `modifiers` option
  modifiers: {
    snakeCase: (str) => str.split(' ').join('-')
  }
})
```

Locale messages the below:

```js
const messages = {
  en: {
    message: {
      snake: 'snake case',
      custom_modifier: "custom modifiers example: @.snakeCase:{'message.snake'}"
    }
  }
}
```

It’s `en` locale that has hierarchical structure in the object.

The `message.snake` has `snake case`. The `message.custom_modifier` has `custom modifiers example: @.snakeCase:{'message.snake'}`, and it’s linked to the locale messages key, which is interpolated with literal.

:::tip NOTE
You can use the interpolations (Named, List, and Literal) for the key of Linked messages.
:::


## Special Characters

The following characters used in the message format syntax are processed by the compiler as special characters:

- `{`
- `}`
- `@`
- `$`
- `|`

If you want to use these characters, you will need to use the [Literal interpolation](#literal-interpolation).

## Rails i18n format

Vue I18n supports the message format that is compatible with [Ruby on Rails i18n](https://guides.rubyonrails.org/i18n.html).

You can interpolate message format syntax with `%` prefixing:

:::danger Important!!
In v10 and later, Rails i18n format will be deprecated. We recommended using Named interpolation.
:::

As an example, the following locale messages resource:

```js
const messages = {
  en: {
    message: {
      hello: '%{msg} world'
    }
  }
}
```

It is defined `en` locale with `{ message: { hello: '%{msg} world' } } }`.

As with [Named interpolation](#named-interpolation), you can specify variables defined in JavaScript. In the locale message above, it is possible to localize it by giving a JavaScript defined `msg` as a parameter to the translation function.

The following is an example of the use of `$t` in a template:

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

As result, the below:

```html
<p>hello world</p>
```

## HTML Message

You can localize it with messages that contain HTML.

:::danger Danger
:warning: Dynamically localizing arbitrary HTML on your site can be very dangerous because it can easily lead to XSS vulnerabilities. Only use HTML interpolation on trusted content and never on user-provided content.

We recommended using the [Component interpolation](../advanced/component).
:::

:::warning Notice
If the message contains HTML, Vue I18n outputs a warning to console when development mode (`process.env.NODE_ENV !== 'production'`), Vue I18n outputs  warning to console.

You can control warning output with the `warnHtmlInMessage` or `warnHtmlMessage` options in `createI18n` function or `useI18n` function.
:::

As an example, the following locale messages resource:

```js
const messages = {
  en: {
    message: {
      hello: 'hello <br> world'
    }
  }
}
```

It is defined `en` locale with `{ message: { hello: 'hello <br> world' } } }`.

The following is an example of the use of `v-html` and `$t` in a template:

```html
<p v-html="$t('message.hello')"></p>
```

As result, the below:

```html
<p>hello
<!--<br> exists but is rendered as html and not a string-->
world</p>
```
