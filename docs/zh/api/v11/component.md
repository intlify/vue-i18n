# 组件

## BaseFormatProps

Vue I18n 提供的组件的基础格式化 Props

**签名：**
```typescript
export interface BaseFormatProps
```

**详情**

Translation、DatetimeFormat 和 NumberFormat 等组件的底层 props 接口定义。

### i18n

**签名：**
```typescript
i18n?: Composer;
```

**详情**

具有现有作用域的 composer 实例。

此选项优先于 `scope` 选项。

### locale

**签名：**
```typescript
locale?: Locale;
```

**详情**

指定用于组件的语言环境。

如果指定，则不会覆盖全局作用域或目标组件的父作用域的语言环境，而是使用指定的语言环境。

### scope

**签名：**
```typescript
scope?: ComponentI18nScope;
```

**详情**

指定在目标组件中使用的作用域。

您可以指定 `global` 或 `parent`。

如果指定 `global`，则使用全局作用域；如果指定 `parent`，则使用目标组件的父作用域。

如果父级是全局作用域，则使用全局作用域；如果是本地作用域，则使用本地作用域。

### tag

**签名：**
```typescript
tag?: string | object;
```

**详情**

用于包装在插槽中分发的内容。如果省略，插槽内容将被视为 Fragments。

您可以指定基于字符串的标签名称（如 `p`），或定义组件的对象。

## DatetimeFormat

日期时间格式化组件

**签名：**
```typescript
DatetimeFormat: {
    new (): {
        $props: VNodeProps & DatetimeFormatProps & BaseFormatProps;
    };
}
```

**详情**

有关详细信息，请参阅以下项目

:::danger
不支持 IE，因为 [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts) 不支持 `Intl.DateTimeFormat#formatToParts`

如果要使用它，需要使用 [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
:::

**另请参阅**
- [FormattableProps](component#formattableprops)
- [BaseFormatProps](component#baseformatprops)
- [自定义格式化](../../guide/essentials/datetime#custom-formatting)

## DatetimeFormatProps

DatetimeFormat 组件 Props

**签名：**
```typescript
export type DatetimeFormatProps = FormattableProps<number | Date, Intl.DateTimeFormatOptions>;
```

## FormattableProps

可格式化 Props

**签名：**
```typescript
export interface FormattableProps<Value, Format> extends BaseFormatProps
```

**详情**

在 DatetimeFormat 或 NumberFormat 组件中使用的 props

### format

**签名：**
```typescript
format?: string | Format;
```

**详情**

在目标组件中使用的格式。

指定格式键字符串或 ECMA 402 中 Intl API 定义的格式。

### value

**签名：**
```typescript
value: Value;
```

**详情**

为目标组件指定的值

## NumberFormat

数字格式化组件

**签名：**
```typescript
NumberFormat: {
    new (): {
        $props: VNodeProps & NumberFormatProps & BaseFormatProps;
    };
}
```

**详情**

有关详细信息，请参阅以下项目

:::danger
不支持 IE，因为 [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts) 不支持 `Intl.NumberFormat#formatToParts`

如果要使用它，需要使用 [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)
:::

**另请参阅**
- [FormattableProps](component#formattableprops)
- [BaseFormatProps](component#baseformatprops)
- [自定义格式化](../../guide/essentials/number#custom-formatting)

## NumberFormatProps

NumberFormat 组件 Props

**签名：**
```typescript
export type NumberFormatProps = FormattableProps<number, Intl.NumberFormatOptions>;
```

## Translation

翻译组件

**签名：**
```typescript
Translation: {
    new (): {
        $props: VNodeProps & TranslationProps;
    };
}
```

**详情**

有关详细信息，请参阅以下项目

**另请参阅**
- [TranslationProps](component#translationprops)
- [BaseFormatProps](component#baseformatprops)
- [组件插值](../../guide/advanced/component)

**示例**


```html
<div id="app">
  <!-- ... -->
  <i18n keypath="term" tag="label" for="tos">
    <a :href="url" target="_blank">{{ $t('tos') }}</a>
  </i18n>
  <!-- ... -->
</div>
```


```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    tos: 'Term of Service',
    term: 'I accept xxx {0}.'
  },
  ja: {
    tos: '利用規約',
    term: '私は xxx の{0}に同意します。'
  }
}

const i18n = createI18n({
  locale: 'en',
  messages
})

const app = createApp({
  data: {
    url: '/term'
  }
}).use(i18n).mount('#app')
```




## TranslationProps

Translation 组件 Props

**签名：**
```typescript
export interface TranslationProps extends BaseFormatProps
```

### keypath

**签名：**
```typescript
keypath: string;
```

**详情**

可以指定语言环境消息键 prop

### plural

**签名：**
```typescript
plural?: number | string;
```

**详情**

选择消息数量的复数 prop
