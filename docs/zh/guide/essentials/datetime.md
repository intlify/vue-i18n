# 日期时间格式化

## 基本用法

你可以使用自定义的格式来本地化日期时间。

日期时间格式如下：

```js
const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  'ja-JP': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
    }
  }
}
```

如上所示，你可以定义命名的日期时间格式（例如 `short`、`long` 等），并且需要使用 [ECMA-402 Intl.DateTimeFormat 的选项](https://tc39.es/ecma402/#datetimeformat-objects)。

之后，在使用语言环境消息时，你需要指定 `createI18n` 的 `datetimeFormats` 选项：

```js
const i18n = createI18n({
  datetimeFormats
})
```

要使用 Vue I18n 本地化日期时间值，请使用 `$d`。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> 请注意，在 VueI18n v9 中，选项名称是 **`datetimeFormats`**，而不是 `dateTimeFormats`。要了解更多详细信息，请访问 [迁移指南](../../guide/migration/breaking#rename-to-datetimeformats-from-datetimeformats)。

> [!TIP]
> `$d` 有多个重载。你可以在 [API 参考](../../../api/vue/interfaces/ComponentCustomProperties.md#d) 中找到更多信息。

> [!NOTE]
> 支持本地化的一些方法包括：
>
> - `$d` (用于传统 API 模式和组合式 API 模式)
> - 内置 DatetimeFormat 组件 (`i18n-d`)
> - 从 `useI18n` 导出的 `d` (用于组合式 API 模式)

<!-- eslint-enable markdown/no-missing-label-refs -->

以下是在模板中使用 `$d` 的示例：

```html
<p>{{ $d(new Date(), 'short') }}</p>
<p>{{ $d(new Date(), 'long', 'ja-JP') }}</p>
```

第一个参数是日期时间值（例如 `Date`、时间戳），第二个参数是日期时间格式名称。最后一个参数是语言环境值。

结果如下：

```html
<p>Apr 19, 2017</p>
<p>2017年4月19日(水) 午前2:19</p>
```

## 自定义格式化

`$d` 返回完全格式化的日期时间字符串，只能作为一个整体使用。当你需要为格式化日期时间的某些部分（如小数位）设置样式时，`$d` 是不够的。在这种情况下，DatetimeFormat 组件 (`i18n-d`) 会很有帮助。

使用最少的属性集，`i18n-d` 生成与 `$d` 相同的输出，并包装在配置的 DOM 元素中。

以下模板：

```html
<i18n-d tag="p" :value="new Date()"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long" locale="ja-JP-u-ca-japanese"></i18n-d>
```

DatetimeFormat 组件有一些属性。

`tag` 是用于设置标签的属性。

`value` 属性用于设置要格式化的日期时间值。

`format` 属性用于设置由 `createI18n` 的 `datetimeFormats` 选项定义的格式。

`locale` 属性用于设置语言环境。它使用此属性指定的语言环境进行本地化，而不是使用 `createI18n` 的 `locale` 选项指定的语言环境。

将产生以下输出：

```html
<p>11/3/2020</p>
<p>11/03/2020, 02:35:31 AM</p>
<p>令和2年11月3日火曜日 午前2:35:31 日本標準時</p>
```

但是，当此组件与 [作用域插槽](https://cn.vuejs.org/guide/components/slots.html#scoped-slots) 一起使用时，它的真正威力就会发挥出来。

假设要求使用更粗的字体渲染日期时间的纪元部分。这可以通过指定 `era` 作用域插槽元素来实现：

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
</i18n-d>
```

上面的模板将产生以下 HTML：

```html
<span><span style="color: green;">R</span>2年11月3日火曜日 午前2:35:31 日本標準時</span>
```

可以同时指定多个作用域插槽：

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
  <template #literal="props">
    <span style="color: green">{{ props.literal }}</span>
  </template>
</i18n-d>
```

（为了更好的可读性，生成的 HTML 进行了格式化）

```html
<span>
  <span style="color: green;">R</span>2
  <span style="color: green;">年</span>11
  <span style="color: green;">月</span>3
  <span style="color: green;">日</span>火曜日
  <span style="color: green;"> </span>午前3
  <span style="color: green;">:</span>09
  <span style="color: green;">:</span>56
  <span style="color: green;"> </span>日本標準時
</span>
```

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> 支持的作用域插槽的完整列表以及其他 `i18n-d` 属性可以在 [API 参考](../../../api/general/type-aliases/DatetimeFormat.md) 中找到。

<!-- eslint-enable markdown/no-missing-label-refs -->

## 作用域解析

DatetimeFormat 组件的作用域解析与 Translation 组件相同。

请参阅 [这里](../advanced/component.md#scope-resolving)。
