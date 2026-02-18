# 消息函数

Vue I18n 建议使用基于字符串的列表、命名和字面量格式作为语言环境消息来翻译消息。

但是，有时很难解析基于字符串的消息格式语法。

例如，假设你想用法语处理以下消息：

- Manger de la soupe
- Manger une pomme
- Manger du pain
- Manger de l’orge

如你所见，名词前面的冠词会根据性别和语音而有所不同。

Vue I18n 消息格式语法支持的功能可能无法支持这些特定于语言的用例。

然而，由于复杂的语言语法，有些情况下你确实需要 JavaScript 的全部编程能力。
所以，你可以使用 **消息函数** 来代替基于字符串的消息。

:::tip 注意
使用消息格式语法编写的消息将使用 Vue I18n 消息编译器编译为消息函数。消息函数和缓存机制可最大限度地提高性能收益。
:::

## 基本用法

以下是一个返回简单问候语的消息函数：

```js
const messages = {
  en: {
    greeting: (ctx) => 'hello!'
  }
}
```

消息函数接受 **消息上下文 (Message context)** 作为第一个参数，它有几个属性和函数。我们将在以下部分解释如何使用它，所以让我们继续。

消息函数的使用非常简单！你只需使用 `t`（从 `useI18n()` 获取）或 `$t`（通过全局注入）指定消息函数的键：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting') }}</p>
```

输出如下：

```html
<p>hello!</p>
```

消息函数输出消息函数返回的 **字符串** 值。

:::tip 注意
如果你需要使用 Translation 组件 (`i18n-t`)，你需要支持不仅返回字符串值，还要返回 **VNode** 值。

为了支持 Translation 组件的使用，MessageContext 的 `type` 属性被使用，如下面的代码示例所示：

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

如果你还没有这样做，建议在深入研究消息函数之前通读 [Vue 渲染函数](https://cn.vuejs.org/guide/extras/render-function.html#the-virtual-dom-tree)。
:::

## 具名插值

Vue I18n 支持 [具名插值](../essentials/syntax#named-interpolation) 作为基于字符串的消息格式。Vue I18n 使用 `$t` 或 `t` 插值参数值，并可以将其输出。

你可以使用消息上下文的 `named` 函数做同样的事情。

这是问候的例子：

```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```

模板：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p>
```

输出如下：

```html
<p>hello, DIO!</p>
```

你需要指定解析用 `$t` 或 `t` 的 named 指定的值的键。

## 列表插值

Vue I18n 支持 [列表插值](../essentials/syntax#list-interpolation) 作为基于字符串的消息格式。Vue I18n 使用 `$t` 或 `t` 插值参数值，并可以将其输出。

你可以使用消息上下文的 `list` 函数做同样的事情。

这是问候的例子：

```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```

模板：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting', ['DIO']) }}</p>
```

输出如下：

```html
<p>hello, DIO!</p>
```

你需要指定解析用 `$t` 或 `t` 的 list 指定的值的索引。


## 链接消息

Vue I18n 支持 [链接消息](../essentials/syntax#linked-messages) 作为基于字符串的消息格式。Vue I18n 使用 `$t` 或 `t` 插值参数值，并可以将其输出。

你可以使用消息上下文的 `linked` 函数做同样的事情。

这是消息函数的例子：

```js
const messages = {
  en: {
    the_world: 'the world',
    dio: 'DIO:',
    linked: ({ linked }) => `${linked('message.dio')} ${linked('message.the_world')} !!!!`
  }
}
```

模板：

<!-- eslint-skip -->

```html
<p>{{ $t('linked') }}</p>
```

输出如下：

```html
<p>DIO: the world !!!!</p>
```

你需要指定解析用 `$t` 或 `t` 指定的值的键。

## 复数形式

Vue I18n 支持 [复数形式](../essentials/pluralization) 作为基于字符串的消息格式。Vue I18n 使用 `$t` 或 `t` 插值参数值，并可以将其输出。

你可以使用消息上下文的 `plural` 函数做同样的事情。

这是消息函数的例子：

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

模板：

<!-- eslint-skip -->

```html
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>

<p>{{ $t('apple', 0) }}</p>
<p>{{ $t('apple', 1) }}</p>
<p>{{ $t('apple', { count: 10 }, 10) }}</p>
```

输出如下：

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

你需要指定解析用 `$t` 或 `t` 指定的值的键。
