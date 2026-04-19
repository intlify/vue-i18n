:::warning v11 Documentation
This is the documentation for **Vue I18n v11**. If you are using v12 or later, see the [latest guide](/guide/essentials/started).
:::

# Custom Directive

:::danger NOTE
The `v-t` directive will be deprecated in version 11 and removed in version 12. This section is intended for users still working with version 10.
:::

In addition to using `$t`, you can also use the `v-t` custom directive for translations.

## String Syntax

You can pass the key path of locale messages using string syntax.

### JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'hi there!' },
    ja: { hello: 'こんにちは！' }
  }
})

const app = createApp({
  data: () => ({ path: 'hello' })
})
app.use(i18n)
app.mount('#app')
```

### Template:

<!-- eslint-skip -->

```html
<div id="string-syntax">
  <!-- Using a string literal -->
  <p v-t="'hello'"></p>
  <!-- Binding a key path via data -->
  <p v-t="path"></p>
</div>
```

### Output:

```html
<div id="string-syntax">
  <p>hi there!</p>
  <p>hi there!</p>
</div>
```

## Object Syntax

Alternatively, you can use object syntax.

### JavaScript:

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hi: 'Hi, {name}!'
        bye: 'Goodbye!',
        apple: 'no apples | one apple | {count} apples'
      }
    },
    ja: {
      message: {
        hi: 'こんにちは、{name}！',
        bye: 'さようなら！',
        apple: 'リンゴはありません | 一つのりんご | {count} りんご'
      }
    }
  }
})

const app = createApp({
  data() {
    return {
      byePath: 'message.bye',
      appleCount: 7,
    }
  }
})
app.use(i18n)
app.mount('#object-syntax')
```

### Template:

<!-- eslint-skip -->

```html
<div id="object-syntax">
  <!-- Using an object with arguments -->
  <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
  <!-- Binding a key path via data -->
  <p v-t="{ path: byePath, locale: 'en' }"></p>
  <!-- Pluralization -->
  <p v-t="{ path: 'message.apple', plural: appleCount }"></p>
</div>
```

### Output:

```html
<div id="object-syntax">
  <p>こんにちは、kazupon！</p>
  <p>Goodbye!</p>
  <p>7 りんご</p>
</div>
```

## Scope

As explained in [the scope section](../essentials/scope.md), `vue-i18n` supports both global and local scopes.

The behavior of `v-t` depends on the scope in which it is used:

- **Local scope**: Applied when using the i18n option in Legacy API style or setting `useScope: 'local'` in `useI18n`.
- **Global scope**: Used in all other cases.

## `$t` vs `v-t`

### `$t`

`$t` is a function of the `VueI18n` instance with the following advantages and disadvantages:

#### Pros:
- Allows for **flexible usage** within templates, including mustache syntax `{}`.
- Supports computed properties and methods within Vue components.

#### Cons:
- `$t` is executed **on every re-render**, which can add translation overhead.

### `v-t`

`v-t` is a custom directive with its own set of pros and cons:

#### Pros:
- Offers **better performance** than `$t`, as translations can be preprocessed by the Vue compiler module provided by [vue-i18n-extensions](https://github.com/intlify/vue-i18n-extensions).
- Enables **performance optimizations** by reducing runtime translation overhead.

#### Cons:
- Less flexible than `$t`; it’s **more complex** to use.
- Inserts translated content directly into the element’s `textContent`, which means it cannot be used inside inline HTML structures or combined with other dynamic template expressions.
- When using server-side rendering (SSR), you must configure a [custom transform](https://github.com/intlify/vue-i18n-extensions#server-side-rendering-for-v-t-custom-directive) by setting the `directiveTransforms` option in the `compile` function of `@vue/compiler-ssr`.