# 数字格式化

## 基本用法

你可以使用自定义的格式来本地化数字。

数字格式如下：

```js
const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD', notation: 'standard'
    },
    decimal: {
      style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
    },
    percent: {
      style: 'percent', useGrouping: false
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', useGrouping: true, currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal', minimumSignificantDigits: 3, maximumSignificantDigits: 5
    },
    percent: {
      style: 'percent', useGrouping: false
    }
  }
}
```

如上所示，你可以定义命名的数字格式（例如 `currency` 等），并且需要使用 [ECMA-402 Intl.NumberFormat 的选项](https://tc39.es/ecma402/#numberformat-objects)。

之后，在使用语言环境消息时，你需要指定 `createI18n` 的 `numberFormats` 选项：

```js
const i18n = createI18n({
  numberFormats
})
```

要使用 Vue I18n 本地化数字值，请使用 `$n`（通过全局注入）或 `useI18n()` 的 `n`。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> `$n` 有一些重载。关于这些重载，请参阅 [API 参考](../../../api/vue/interfaces/ComponentCustomProperties.md#n)

<!-- eslint-enable markdown/no-missing-label-refs -->

以下是在模板中使用 `$n` 的示例：

```html
<p>{{ $n(10000, 'currency') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP', { useGrouping: false }) }}</p>
<p>{{ $n(987654321, 'currency', { notation: 'compact' }) }}</p>
<p>{{ $n(0.99123, 'percent') }}</p>
<p>{{ $n(0.99123, 'percent', { minimumFractionDigits: 2 }) }}</p>
<p>{{ $n(12.11612345, 'decimal') }}</p>
<p>{{ $n(12145281111, 'decimal', 'ja-JP') }}</p>
```

第一个参数是数值，第二个参数是数字格式名称。最后一个参数是语言环境值。

结果如下：

```html
<p>$10,000.00</p>
<p>￥10,000</p>
<p>￥10000</p>
<p>$988M</p>
<p>99%</p>
<p>99.12%</p>
<p>12.12</p>
<p>12,145,000,000</p>
```

## 自定义格式化

`$n` 返回完全格式化的数字字符串，只能作为一个整体使用。当你需要为格式化数字的某些部分（如小数位）设置样式时，`$n` 是不够的。在这种情况下，NumberFormat 组件 (`i18n-n`) 会很有帮助。

使用最少的属性集，`i18n-n` 生成与 `$n` 相同的输出，并包装在配置的 DOM 元素中。

以下模板：

```html
<i18n-n tag="span" :value="100"></i18n-n>
<i18n-n tag="span" :value="100" format="currency"></i18n-n>
<i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>
```

NumberFormat 组件有一些属性。

`tag` 是用于设置标签的属性。

`value` 是用于设置要格式化的数值的属性。

`format` 是用于设置由 `createI18n` 的 `numberFormats` 选项定义的格式的属性。

`locale` 是用于设置语言环境的属性。它使用此属性指定的语言环境进行本地化，而不是使用 `createI18n` 的 `locale` 选项指定的语言环境。

将产生以下输出：

```html
<span>100</span>
<span>$100.00</span>
<span>￥100</span>
```

但是，当此组件与 [作用域插槽](https://cn.vuejs.org/guide/components/slots.html#scoped-slots) 一起使用时，它的真正威力就会发挥出来。

假设要求使用更粗的字体渲染数字的整数部分。这可以通过指定 `integer` 作用域插槽元素来实现：

```html
<i18n-n tag="span" :value="100" format="currency">
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
</i18n-n>
```

上面的模板将产生以下 HTML：

```html
<span>$<span style="font-weight: bold">100</span>.00</span>
```

可以同时指定多个作用域插槽：

```html
<i18n-n tag="span" :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
  <template #currency="slotProps">
    <span style="color: green">{{ slotProps.currency }}</span>
  </template>
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
  <template #group="slotProps">
    <span style="font-weight: bold">{{ slotProps.group }}</span>
  </template>
  <template #fraction="slotProps">
    <span style="font-size: small">{{ slotProps.fraction }}</span>
  </template>
</i18n-n>
```

（为了更好的可读性，生成的 HTML 进行了格式化）

```html
<span>
  <span style="color: green">€</span>
  <span style="font-weight: bold">1</span>
  <span style="font-weight: bold">,</span>
  <span style="font-weight: bold">234</span>
  .
  <span style="font-size: small">00</span>
</span>
```

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> 支持的作用域插槽的完整列表以及其他 `i18n-n` 属性可以在 [API 参考](../../../api/general/type-aliases/NumberFormat.md) 中找到。

<!-- eslint-enable markdown/no-missing-label-refs -->

## 作用域解析

NumberFormat 组件的作用域解析与 Translation 组件相同。

请参阅 [这里](../advanced/component.md#scope-resolving)。
