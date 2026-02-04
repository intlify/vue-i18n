# 自定义指令

:::danger 注意
`v-t` 指令将在版本 11 中弃用，并在版本 12 中删除。本节适用于仍在使用版本 10 的用户。
:::

除了使用 `$t`，你还可以使用 `v-t` 自定义指令进行翻译。

## 字符串语法

你可以使用字符串语法传递语言环境消息的键路径。

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

### 模板:

<!-- eslint-skip -->

```html
<div id="string-syntax">
  <!-- 使用字符串字面量 -->
  <p v-t="'hello'"></p>
  <!-- 通过 data 绑定键路径 -->
  <p v-t="path"></p>
</div>
```

### 输出:

```html
<div id="string-syntax">
  <p>hi there!</p>
  <p>hi there!</p>
</div>
```

## 对象语法

或者，你可以使用对象语法。

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

### 模板:

<!-- eslint-skip -->

```html
<div id="object-syntax">
  <!-- 使用带参数的对象 -->
  <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
  <!-- 通过 data 绑定键路径 -->
  <p v-t="{ path: byePath, locale: 'en' }"></p>
  <!-- 复数形式 -->
  <p v-t="{ path: 'message.apple', plural: appleCount }"></p>
</div>
```

### 输出:

```html
<div id="object-syntax">
  <p>こんにちは、kazupon！</p>
  <p>Goodbye!</p>
  <p>7 りんご</p>
</div>
```

## 作用域

正如在 [作用域部分](../essentials/scope.md) 中解释的那样，`vue-i18n` 支持全局和本地作用域。

`v-t` 的行为取决于使用它的作用域：

- **本地作用域**：在使用传统 API 风格的 i18n 选项或在 `useI18n` 中设置 `useScope: 'local'` 时应用。
- **全局作用域**：在所有其他情况下使用。

## `$t` vs `v-t`

### `$t`

`$t` 是 `VueI18n` 实例的一个函数，具有以下优点和缺点：

#### 优点:
- 允许在模板内 **灵活使用**，包括 mustache 语法 `{}`。
- 支持 Vue 组件内的计算属性和方法。

#### 缺点:
- `$t` 在 **每次重新渲染时执行**，这可能会增加翻译开销。

### `v-t`

`v-t` 是一个自定义指令，有其自己的一套优缺点：

#### 优点:
- 提供比 `$t` **更好的性能**，因为翻译可以通过 [vue-i18n-extensions](https://github.com/intlify/vue-i18n-extensions) 提供的 Vue 编译器模块进行预处理。
- 通过减少运行时翻译开销来实现 **性能优化**。

#### 缺点:
- 不如 `$t` 灵活；使用起来 **更复杂**。
- 直接将翻译后的内容插入到元素的 `textContent` 中，这意味着它不能在内联 HTML 结构中使用或与其他动态模板表达式组合使用。
- 使用服务器端渲染 (SSR) 时，你必须通过在 `@vue/compiler-ssr` 的 `compile` 函数中设置 `directiveTransforms` 选项来配置 [自定义转换](https://github.com/intlify/vue-i18n-extensions#server-side-rendering-for-v-t-custom-directive)。
