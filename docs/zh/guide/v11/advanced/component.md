:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# 组件插值

## 基本用法

有时，我们需要使用包含在 HTML 标签或组件中的语言环境消息进行本地化。例如：

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

在上面的消息中，如果你使用 `$t`，你可能会尝试编写以下语言环境消息：

```js
const messages = {
  en: {
    term1: 'I Accept xxx\'s',
    term2: 'Terms of Service Agreement'
  }
}
```

你的本地化模板可能如下所示：

<!-- esline-skip -->

```html
<p>{{ $t('term1') }}<a href="/term">{{ $t('term2') }}</a></p>
```

输出：

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

这是非常麻烦的，如果你在语言环境消息中配置 `<a>` 标签，由于使用 `v-html="$t('term')"` 进行本地化，可能会存在 XSS 漏洞。

你可以使用 Translation 组件 (`i18n-t`) 来避免它。例如下面这样。

模板：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="term" tag="label" for="tos">
    <a :href="url" target="_blank">{{ $t('tos') }}</a>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      tos: 'Term of Service',
      term: 'I accept xxx {0}.'
    },
    ja: {
      tos: '利用規約',
      term: '私は xxx の{0}に同意します。'
    }
  }
})

const app = createApp({
  data: () => ({ url: '/term' })
})

app.use(i18n)
app.mount('#app')
```

以下输出：

```html
<div id="app">
  <!-- ... -->
  <label for="tos">
    I accept xxx <a href="/term" target="_blank">Term of Service</a>.
  </label>
  <!-- ... -->
</div>
```

关于上面的例子，请参阅 [示例](https://github.com/intlify/vue-i18n/blob/master/examples/legacy/components/translation.html)

Translation 组件的子级使用 `keypath` 属性的语言环境消息进行插值。在上面的例子中，

:::v-pre
`<a :href="url" target="_blank">{{ $t('tos') }}</a>`
:::

使用 `term` 语言环境消息进行插值。

在上面的例子中，组件插值遵循 **列表插值**。Translation 组件的子级按其出现的顺序进行插值。

<!-- textlint-disable -->
你可以通过指定 `tag` 属性来选择根节点元素类型。如果省略，它默认为 [Fragments](https://v3-migration.vuejs.org/new/fragments.html)。
<!-- textlint-enable -->

## 插槽语法用法

使用具名插槽语法更方便。例如下面这样：

模板：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template v-slot:limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template v-slot:action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      info: 'You can {action} until {limit} minutes from departure.',
      change: 'change your flight',
      refund: 'refund the ticket'
    }
  }
})

const app = createApp({
  data: () => ({
    changeUrl: '/change',
    refundUrl: '/refund',
    changeLimit: 15,
    refundLimit: 30
  })
})

app.use(i18n)
app.mount('#app')
```

输出：

```html
<div id="app">
  <!-- ... -->
  <p>
    You can <a href="/change">change your flight</a> until <span>15</span> minutes from departure.
  </p>
  <!-- ... -->
</div>
```

你也可以在模板中使用以下插槽简写：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template #limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template #action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

:::warning 限制
:warning: 在 Translation 组件中，不支持插槽 props。
:::

### 复数形式用法

你可以通过使用 `plural` 属性在组件插值中使用复数形式。例如下面这样。

模板：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="message.plural" locale="en" :plural="count">
    <template #n>
      <b>{{ count }}</b>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
const { createApp, ref } = Vue
const { createI18n } = VueI18n

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      message: {
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    }
  }
})

const app = createApp({
  setup() {
    const count = ref(2)
    return { count }
  }
})
app.use(i18n)
app.mount('#app')
```

以下输出：
```html
<div id="app" data-v-app="">
  <!-- ... -->
  <b>2</b> bananas
  <!-- ... -->
</div>
```

## 作用域解析

Translation 组件的 [作用域](../essentials/scope.md) 解析默认为 `parent`。

这意味着 Translation 组件使用使用它的父组件中启用的作用域。

如果父组件具有 `useScope: 'global'` 的 `useI18n`，它将使用全局作用域，否则如果 `useScope: 'local'`，它将使用父组件的本地作用域。

但是，你有时候会在浏览器控制台上遇到以下警告消息：

```txt
[intlify] Not found parent scope. use the global scope.
```

如果在使用 Translation 组件的父组件中没有运行 `useI18n`，则会显示此消息。

在这种情况下，Translation 组件的作用域将回退到全局作用域，如警告消息所述。

抑制此警告的一种解决方法是将 `global` 指定为 Translation 组件的 `scope` 属性。

```html
<i18n-t keypath="message.foo" scope="global">
  ...
</i18n-t>
```

:::tip 注意
此警告不会在生产版本中输出到浏览器控制台。
:::

:::warning 注意
这在 petite-vue-i18n 中不可用
:::