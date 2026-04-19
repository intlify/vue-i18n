# v9 重大变更

Vue I18n v9 (适用于 Vue 3) 提供的大多数 API 都力求保持兼容性，以减轻从 v8 (适用于 Vue 2) 迁移的痛苦。但在迁移应用程序时，你可能会遇到一些重大变更。本指南将介绍如何调整你的应用程序以使其与 Vue I18n v9 协同工作。

## API

### `new VueI18n` 变为 `createI18n`

Vue I18n 不再是一个类，而是一组函数。现在你不再编写 `new VueI18n()`，而是必须调用 `createI18n`：

Vue I18n v8.x:

```js{2,4,6-8,11}
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  // ...
})

new Vue({
  i18n,
  // ...
})
```

Vue I18n v9 或更高版本:

```js{2,4-6,11}
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // ...
})

const app = createApp({
  // ...
})
app.use(i18n)
```

**原因**: Vue 3 [全局 API 变更](https://v3-migration.vuejs.org/breaking-changes/global-api.html)，以及 Vue 3 API 架构中与组件实例相关的变更。

### `dateTimeFormats` 重命名为 `datetimeFormats`

Vue I18n v8.x:

```js{3-5}
const i18n = new VueI18n({
  // ...
  dateTimeFormats: {
    // ...
  }
})
```

Vue I18n v9 或更高版本:

```js{3-5}
const i18n = createI18n({
  // ...
  datetimeFormats: {
    // ...
  }
})
```

### 翻译 API 返回值

像 `$t` 和 `t` 这样的翻译 API 函数仅返回 **string**。不再返回对象和数组值。

Vue I18n v8.x:

```js{24}
// 例如：数组结构的本地化消息
const i18n = new VueI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// 例如：错误组件
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ getErrorMessage(code) }}</p>`,
  methods: {
    getErrorMessage(code) {
      return this.$t('errors')[code]
    }
  }
}
```

在 Vue I18n v9 及更高版本中，改为使用 `$tm` / `tm` 获取本地化消息，使用 `$rt` 或 `rt` 解析本地化消息。以下是组合式 API 示例：

```js{24}
// 例如：数组结构的本地化消息
const i18n = createI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// 例如：错误组件
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ errors(code) }}</p>`,
  setup() {
    const { tm, rt } = useI18n()
    const errors = (code) => rt(tm('errors')[code])
    return { errors }
  }
}
```

**原因**: 为了**简单强制**返回翻译结果，并且也是为了支持 TypeScript 类型。

### 复数化 API 返回值

类似于 *[翻译 API 返回值](#翻译-api-返回值)*，像 `$tc` 和 `tc` 这样的复数化 API 函数仅返回 **string**。不再返回对象和数组值。

**原因**: 为了**简单强制**返回翻译结果，并且也是为了支持 TypeScript 类型。

### 移除 `getChoiceIndex`

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `getChoiceIndex` 选项实现代码将在 v10 中完全移除。

<!-- eslint-enable markdown/no-missing-label-refs -->

为了自定义复数化规则，Vue I18n v8.x 扩展了 VueI18n 类的 `getChoiceIndex`。

Vue I18n v8.x:

```js
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n 实例，所以 locale 属性存在
  if (this.locale !== 'ru') {
    // 继续默认实现
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }
  return (choicesLength < 4) ? 2 : 3;
}
```

在 Vue I18n v9 及更高版本中，你可以使用以下选项对其进行自定义：

传统 API 模式:

```js{21-24}
import { createI18n } from 'vue-i18n'

function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const i18n = createI18n({
  // ...
  pluralizationRules: {
    ru: customRule,
    // ...
  },
  // ...
})
```

组合式 API 模式:

```js{23-26}
import { useI18n } from 'vue-i18n'

function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const MyComp = {
  setup() {
    const { t } = useI18n({
      // ...
      pluralRules: {
        ru: customRule,
        // ...
      },
      // ...
    })

    // ...
  }
}
```

**原因**: VueI18n 类已被移除。

### 更改 `warnHtmlInMessage` 选项默认值

在 Vue I18n v8.x 中，`warnHtmlInMessage` 的值为 `"off"`。因此，默认情况下，即使消息包含 HTML，也不会向控制台输出警告。

在 Vue I18n v9 及更高版本中，默认值更改如下：

- 传统 API 模式: `warnHtmlInMessage` 属性: `"warn"`
- 组合式 API 模式: `warnHtmlMessage` 布尔属性, 默认 `true`

在开发模式下，除非你更改此值，否则你将**默认收到控制台警告**。

在生产模式下，为了最大化性能，它不会检测消息是否包含 HTML。

**原因**: 为了加强本地化消息的安全性。

### 版本信息

版本信息现在可以通过导入语法访问，而不是通过 VueI18n 类静态属性访问。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.version)
```

Vue I18n v9 或更高版本:

```js
import { VERSION } from 'vue-i18n'

console.log(VERSION)
```

**原因**: Tree shaking 优化，且 VueI18n 类已被移除。

### 移除 Intl availability

由于主要浏览器现在都支持 [ECMAScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)，因此已将其移除。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.availability)
```

**原因**: IE9 生命周期结束，且 VueI18n 类已被移除。

### 移除自定义格式化器

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `formatter` 选项实现代码将在 v10 中完全移除。
> 作为替代方案，vue-i18n 拥有[自定义消息格式](../advanced/format.md)作为实验性功能。

<!-- eslint-enable markdown/no-missing-label-refs -->

**原因**: 由于很难在新的编译器和运行时 API 中提供自定义格式。我们计划在下一个主要版本中支持它，以便在这些 API 中支持。如果你想使用 ICU 消息格式，可以使用 [@formatjs/vue-intl](https://formatjs.io/docs/vue-intl/)。

### 移除 `preserveDirectiveContent` 选项

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `preserveDirectiveContent` 选项实现代码将在 v10 中完全移除。

<!-- eslint-enable markdown/no-missing-label-refs -->

Vue 3 的 `v-t` 指令现在保留默认内容。因此，该选项及其属性已从 VueI18n 实例中移除。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  preserveDirectiveContent: true,
  // ...
})
```

**原因**: 保持带有 `v-t` 指令的元素内容。

## 消息格式语法

### 移除列表插值的类数组对象

在 Vue I18n v8.x 中，列表插值可以使用类数组对象作为参数，例如：

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  messages: {
    en: {
      greeting: 'hello, {0}!'
    }
  },
  // ...
})
```

```html
<p>{{ $t('greeting', { '0': 'kazupon' }) }}</p>
```

在 Vue I18n v9 及更高版本中，你不能对列表插值使用类数组对象，必须使用数组：

```html
<p>{{ $t('greeting', ['kazupon']) }}</p>
```

**原因**: 提供具有一致参数接口的翻译 API。

### 特殊字符处理

Vue I18n 可以翻译的消息可以使用消息格式语法进行高度翻译，例如：

```txt
@.caml:{'no apples'} | {0} apple | {n}　apples
```

消息格式语法可以使用以下特殊字符来表达：

- `{`, `}`, `@`, `$`, `|`

从 Vue I18n v9 及更高版本开始，消息格式语法现在由消息格式编译器处理，如果你在消息中使用这些特殊字符作为消息的一部分，编译时将会报错。如果你想使用这些特殊字符，你**必须使用字面量插值**。

```txt
// 例如：邮件地址中的 `@` 用例
{emailIdentity}{'@'}{emailDomain}
```

**原因**: 为了让消息格式编译器正确处理消息格式语法中使用的特殊字符，有必要对它们进行限制。

### 移除链接消息的括号分组

在 Vue I18n v8.x 中，链接消息中的键引用和使用括号 `()` 的消息之间有所区分。

Vue I18n v8.x:

```js{5}
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: 'There\'s a reason, you lost, @:(message.dio).'
    }
  }
}
```

在 Vue I18n v9 及更高版本中，不再需要括号，因为消息格式编译器允许你处理**命名插值、列表插值和字面量插值**。

Vue I18n v9 或更高版本:

```js
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: "There's a reason, you lost, @:{'message.dio'}."
    }
  }
}
```

## `v-t` 指令

### 移除 `preserve` 修饰符

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `preserve` 修饰符实现代码将在 v10 中完全移除。

<!-- eslint-enable markdown/no-missing-label-refs -->

类似于 *[移除 `preserveDirectiveContent` 选项](#移除-preservedirectivecontent-选项)*，Vue 3 的 `v-t` 指令现在保留默认内容。因此，`preserve` 修饰符及其相关内容已从 `v-t` 指令中移除。

Vue I18n v8.x:

```html
<p v-t.preserve="'hello'"></p>
```

**原因**: 保持带有 `v-t` 指令的元素内容。

## 翻译组件

### `i18n` 重命名为 `i18n-t`

翻译组件的标签名（在 Vue I18n v8.x 中称为 *i18n 函数式组件*）已更改。

Vue I18n v8.x:

<!-- eslint-skip -->

```html
<i18n path="message.greeting" />
```

Vue I18n v9 或更高版本:

<!-- eslint-skip -->

```html
<i18n-t keypath="message.greeting" />
```

**原因**: 标签名与 i18n 自定义块 `<i18n>` 相同，因此容易与块名称混淆，并且容易在 SFC 中出错。

### `tag` prop 是可选的

在 Vue I18n v8.x 中，`tag` prop 可以通过指定标签名和 `Boolean` 值 `false` 来渲染不带根元素的子元素。

Vue I18n v8.x:

```html{1,3}
<i18n :tag="false" path="message.greeting">
  <span>hello!</span>
</i18n>
```

从 Vue I18n v9 或更高版本开始，你可以通过省略 `tag` prop 来实现相同的效果。

Vue I18n v9 或更高版本:

```html{1,3}
<i18n-t keypath="message.greeting">
  <span>hello!</span>
</i18n-t>
```

**原因**: 因为 Vue 3 现在支持 Fragments。

### `path` prop 重命名为 `keypath` prop

Vue I18n v8.x:

<!-- eslint-skip -->

```html
<i18n path="message.greeting" />
```

Vue I18n v9 或更高版本:

<!-- eslint-skip -->

```html
<i18n-t keypath="message.greeting" />
```

### 移除带有 `place` 属性和 `places` prop 的 place 语法

在 Vue I18n v9 及更高版本中，`place` 属性和 `places` prop 已从组件插值中移除。

Vue I18n v8.x:

```html
<i18n path="info" tag="p" :places="{ limit: refundLimit }">
  <span place="limit">{{ refundLimit }}</span>
  <a place="action" :href="refundUrl">{{ $t('refund') }}</a>
</i18n>
```

Vue I18n v9 或更高版本:

<!-- eslint-skip -->

```html
<i18n-t keypath="info" tag="p">
  <template #limit>
    <span>{{ refundLimit }}</span>
  <template>
  <template #action>
    <a :href="refundUrl">{{ $t('refund') }}</a>
  <template>
</i18n-t>
```

**原因**: 因为可以使用 slots 做同样的事情。

## NumberFormat 组件

### `tag` prop 是可选的

类似于 *[翻译组件部分](#tag-prop-是可选的)*，在 NumberFormat 组件（在 Vue I18n v8.x 中称为 *i18n-n 函数式组件*）中，`tag` prop 可以通过指定标签名和 `Boolean` 值 `false` 来渲染不带根元素的子元素。

Vue I18n v8.x:

```html
<i18n-n :tag="false" :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

从 Vue I18n v9 或更高版本开始，你可以通过省略 `tag` prop 来实现相同的效果。

Vue I18n v9 或更高版本:

```html
<i18n-n :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

**原因**: 因为 Vue 3 现在支持 Fragments。
