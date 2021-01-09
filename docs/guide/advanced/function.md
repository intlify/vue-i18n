# Messages Functions

Vue I18n recommends using the string base on list, named, and literal format as locale messages when translating messages.

However, sometimes string-based message format syntax is difficult to resolve.

For example, suppose you want to handle the following message in French:

- Manger de la soupe
- Manger une pomme
- Manger du pain
- Manger de l’orge

As you can see, the article preceding the noun will vary based on gender and phonetics.

The features supported by Vue I18n  Message Format Syntax may not be able to support these language-specific use cases.

There are situations however, where you really need the full programmatic power of JavaScript, due to the complex language syntax.
So instead of string-based messages, you can use the **Message functions**.

:::tip NOTE
The messages written in message format syntax are compiled into message functions with Vue I18n message compiler. Message functions and caching mechanism to maximize performance gains.
:::

## Basic usage

The following is a message function that returns a simple greeting:

```js
const messages = {
  en: {
    greeting: (ctx) => 'hello!'
  }
}
```

The message function accept the **Message context** as the first argument, which has several props and functions. We’ll explain how to use it in the following sections, so let’s go on.

The use of the message function is very easy! You just specify the key of the message function with `$t` or `t`:

```html
<p>{{ $t('greeting') }}</p>
```

Output is the below:

```html
<p>hello!</p>
```

The message function outputs the message of the return **string** value of the message function.

:::tip NOTE
If you need to use the Translation component (`i18n-t`), you need to support returning not only the string value, but also the **VNode** value.

To support for Translatiion component usage, the `type` prop of MessageContext is used as shown in the following code example:

```js
import { createVNode, Text } from 'vue'

const messages = {
  en: {
    greeting: ({ type }) => type === 'vnode'
      ? createVNode(Text, null, 'hello', 0)
      : 'hello'
  }
}
```

If you haven’t already, it’s recommended to read through the [Vue render function](https://v3.vuejs.org/guide/render-function.html#the-dom-tree) before diving into message functions.
:::

## Named interpolation

Vue I18n supports [named interpolation](../essentials/syntax#named-interpolation) as a string-based message format. Vue I18n interpolate the parameter values with `$t` or `t`, and it can be output it.

You can use the `named` function of the message context to do the same thing.

Here is the example of greeting:

```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```

Template:

```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p>
```

Output is the below:

```html
<p>hello, DIO!</p>
```

You need to specify the key that resolves the value specified with the named of `$t` or `t`.

## List interplation

Vue I18n supports [list interpolation](../essentials/syntax#list-interpolation) as a string-based message format. Vue I18n interpolate the parameter values with `$t` or `t`, and it can be output it.

You can use the `list` function of the message context to do the same thing.

Here is the example of greeting:

```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```

Template:

```html
<p>{{ $t('greeting', ['DIO']) }}</p>
```

Output is the below:

```html
<p>hello, DIO!</p>
```

You need to specify the index that resolves the value specified with the list of `$t` or `t`.


## Linked messages

Vue I18n supports [linked messages](../essentials/syntax#linked-messages) as a string-based message format. Vue I18n interpolate the parameter values with `$t` or `t`, and it can be output it.

You can use the `linked` function of the message context to do the same thing.

Here is the example of message function:

```js
const messages = {
  en: {
    the_world: 'the world',
    dio: 'DIO:',
    linked: ({ linked }) => `${linked('message.dio')} ${linked('message.the_world')} !!!!`
  }
}
```

Template:

```html
<p>{{ $t('linked') }}</p>
```

Output is the below:

```html
<p>DIO: the world !!!!</p>
```

You need to specify the key that resolves the value specified with `$t` or `t`.

## Pluralization

Vue I18n supports [pluralization](../essentials/pluralization) as a string-based message format. Vue I18n interpolate the parameter values with `$tc` or `tc`, and it can be output it.

You can use the `plural` function of the message context to do the same thing.

Here is the example of message function:

```js
const messages = {
  en: {
    car: ({ plural }) => plural(['car', 'cars']),
    apple: ({ plural, named }) =>
      plural([
        'no apples',
        'one apple',
        `${named('count')} apples`
      ])
  }
}
```

Template:

```html
<p>{{ $tc('car', 1) }}</p>
<p>{{ $tc('car', 2) }}</p>

<p>{{ $tc('apple', 0) }}</p>
<p>{{ $tc('apple', 1) }}</p>
<p>{{ $tc('apple', 10, { count: 10 }) }}</p>
```

Output is the below:

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

You need to specify the key that resolves the value specified with `$tc` or `tc`.
