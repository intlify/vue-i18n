# Custom Directive

You can translate not only with `$t`, but also with the `v-t` custom directive.

## String syntax

You can pass the keypath of locale messages with string syntax.

Javascript:

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

Templates:

```html
<div id="string-syntax">
  <!-- string literal -->
  <p v-t="'hello'"></p>
  <!-- keypath binding via data -->
  <p v-t="path"></p>
</div>
```

Outputs:

```html
<div id="string-syntax">
  <p>hi there!</p>
  <p>hi there!</p>
</div>
```

## Object syntax

You can use object syntax.

Javascript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hi: 'Hi, {name}!',
        bye: 'good bye!',
        apple: 'no apples | one apple | {count} apples'
      }
    },
    ja: {
      message: {
        hi: 'こんにちは、 {name}！',
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

Templates:

```html
<div id="object-syntax">
  <!-- literal -->
  <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
  <!-- data binding via data -->
  <p v-t="{ path: byePath, locale: 'en' }"></p>
  <!-- pluralization -->
  <p v-t="{ path: 'message.apple', plural: appleCount }"></p>
</div>
```

Outputs:

```html
<div id="object-syntax">
  <p>こんにちは、 kazupon！</p>
  <p>good bye!</p>
  <p>7 りんご</p>
</div>
```

## scoping

As mentioned in [the scope section](../essentials/scope.md), vue-i18n has a global scope and a local scope.

The scope under which `v-t` is also affected by scope when it works.

- local scope: using the i18n option in Legacy API style or using `useScope: ‘local'` in `useI18n`.
- global scope: all cases other than the above.


## `$t` vs `v-t`

### `$t`

`$t` is function of VueI18n instance. It has the following pros and cons:

#### Pros

You can **flexibly** use mustache syntax `{}` in templates and also computed props and methods in Vue component instance.

#### Cons

`$t` is executed **every time** when re-render occurs, so it does have translation costs.

### `v-t`

`v-t` is a custom directive. It has the following pros and cons:

#### Pros

`v-t` has **better performance** than the `$t` function due to its pre-translation is possible with the Vue compiler module which was provided by [vue-i18n-extensions](https://github.com/intlify/vue-i18n-extensions).

Therefore it’s possible to make **more performance optimizations**.

#### Cons

`v-t` cannot be flexibly used like `$t`, it’s rather **complex**. The translated content with `v-t` is inserted into the `textContent` of the element. Also, when you use server-side rendering, you need to set the [custom transform](https://github.com/intlify/vue-i18n-extensions#server-side-rendering-for-v-t-custom-directive) to `directiveTransforms` option of the `compile` function of `@vue/compiler-ssr`.
