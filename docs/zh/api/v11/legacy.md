# 传统 API

## Choice

**签名：**
```typescript
export type Choice = number;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## DateTimeFormatResult

**签名：**
```typescript
export type DateTimeFormatResult = string;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## LocaleMessageObject

**签名：**
```typescript
export type LocaleMessageObject<Message = string> = LocaleMessageDictionary<Message>;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## NumberFormatResult

**签名：**
```typescript
export type NumberFormatResult = string;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## PluralizationRulesMap

**签名：**
```typescript
export type PluralizationRulesMap = {
    [locale: string]: PluralizationRule;
};
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## TranslateResult

**签名：**
```typescript
export type TranslateResult = string;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

## VueI18n

VueI18n 传统接口

**签名：**
```typescript
export interface VueI18n<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends string ? [ResourceLocales] extends [never] ? Locale : ResourceLocales : OptionLocale | ResourceLocales, Composition extends Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale> = Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>>
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

此接口与 `VueI18n` 类（Vue I18n v8.x 提供）的接口兼容。

### availableLocales

**签名：**
```typescript
readonly availableLocales: Composition['availableLocales'];
```

**详情**

`messages` 中可用语言环境的列表，按词法顺序排列。

### d

日期时间格式化

**签名：**
```typescript
d: VueI18nDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [VueI18nDateTimeFormatting](legacy#vuei18ndatetimeformatting)

### datetimeFormats

**签名：**
```typescript
readonly datetimeFormats: {
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    };
```

**详情**

本地化的日期时间格式。

**另请参阅**
- [日期时间格式化](../../guide/essentials/datetime)

### escapeParameterHtml

**签名：**
```typescript
escapeParameterHtml: Composition['escapeParameter'];
```

**详情**

插值参数是否在消息翻译之前进行转义。

**另请参阅**
- [HTML 消息](../../guide/essentials/syntax#html-message)

### fallbackLocale

**签名：**
```typescript
fallbackLocale: FallbackLocales<Locales>;
```

**详情**

此 VueI18n 实例当前使用的回退语言环境。

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### formatFallbackMessages

**签名：**
```typescript
formatFallbackMessages: Composition['fallbackFormat'];
```

**详情**

当回退到 `fallbackLocale` 或 root 时是否禁止警告。

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### getDateTimeFormat

获取日期时间格式

**签名：**
```typescript
getDateTimeFormat: Composition['getDateTimeFormat'];
```

**详情**

从 VueI18n 实例 [datetimeFormats](legacy#datetimeformats) 获取日期时间格式。

### getLocaleMessage

获取语言环境消息

**签名：**
```typescript
getLocaleMessage: Composition['getLocaleMessage'];
```

**详情**

从 VueI18n 实例 [messages](legacy#messages) 获取语言环境消息。

### getNumberFormat

获取数字格式

**签名：**
```typescript
getNumberFormat: Composition['getNumberFormat'];
```

**详情**

从 VueI18n 实例 [numberFormats](legacy#numberFormats) 获取数字格式。

### id

**签名：**
```typescript
id: number;
```

**详情**

实例 ID。

### locale

**签名：**
```typescript
locale: Locales;
```

**详情**

此 VueI18n 实例当前使用的语言环境。

如果语言环境包含地域和方言，则此语言环境包含隐式回退。

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)

### mergeDateTimeFormat

合并日期时间格式

**签名：**
```typescript
mergeDateTimeFormat: Composition['mergeDateTimeFormat'];
```

**详情**

将日期时间格式合并到 VueI18n 实例 [datetimeFormats](legacy#datetimeformats)。

### mergeLocaleMessage

合并语言环境消息

**签名：**
```typescript
mergeLocaleMessage: Composition['mergeLocaleMessage'];
```

**详情**

将语言环境消息合并到 VueI18n 实例 [messages](legacy#messages)。

### mergeNumberFormat

合并数字格式

**签名：**
```typescript
mergeNumberFormat: Composition['mergeNumberFormat'];
```

**详情**

将数字格式合并到 VueI18n 实例 [numberFormats](legacy#numberFormats)。

### messages

**签名：**
```typescript
readonly messages: {
        [K in keyof Messages]: Messages[K];
    };
```

**详情**

本地化的语言环境消息。

**另请参阅**
- [快速开始](../../guide/essentials/started)

### missing

**签名：**
```typescript
missing: MissingHandler | null;
```

**详情**

本地化缺失的处理程序。

### modifiers

**签名：**
```typescript
readonly modifiers: Composition['modifiers'];
```

**详情**

链接消息的自定义修饰符。

**另请参阅**
- [自定义修饰符](../../guide/essentials/syntax#custom-modifiers)

### n

数字格式化

**签名：**
```typescript
n: VueI18nNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [VueI18nNumberFormatting](legacy#vuei18nnumberformatting)

### numberFormats

**签名：**
```typescript
readonly numberFormats: {
        [K in keyof NumberFormats]: NumberFormats[K];
    };
```

**详情**

本地化的数字格式。

**另请参阅**
- [数字格式化](../../guide/essentials/number)

### pluralizationRules

一组单词复数化规则

**签名：**
```typescript
pluralizationRules: Composition['pluralRules'];
```

**另请参阅**
- [自定义复数化](../../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**签名：**
```typescript
postTranslation: PostTranslationHandler<VueMessageType> | null;
```

**详情**

翻译后处理的处理程序。

### rt

解析语言环境消息翻译

**签名：**
```typescript
rt: VueI18nResolveLocaleMessageTranslation<Locales>;
```

**详情**

关于详细函数，请参阅 [VueI18nResolveLocaleMessageTranslation](legacy#vuei18nresolvelocalemessagetranslation)

### setDateTimeFormat

设置日期时间格式

**签名：**
```typescript
setDateTimeFormat: Composition['setDateTimeFormat'];
```

**详情**

将日期时间格式设置为 VueI18n 实例 [datetimeFormats](legacy#datetimeformats)。

### setLocaleMessage

设置语言环境消息

**签名：**
```typescript
setLocaleMessage: Composition['setLocaleMessage'];
```

**详情**

将语言环境消息设置为 VueI18n 实例 [messages](legacy#messages)。

### setNumberFormat

设置数字格式

**签名：**
```typescript
setNumberFormat: Composition['setNumberFormat'];
```

**详情**

将数字格式设置为 VueI18n 实例 [numberFormats](legacy#numberFormats)。

### silentFallbackWarn

**签名：**
```typescript
silentFallbackWarn: Composition['fallbackWarn'];
```

**详情**

本地化失败时是否禁止回退警告。

### silentTranslationWarn

**签名：**
```typescript
silentTranslationWarn: Composition['missingWarn'];
```

**详情**

本地化失败时是否禁止输出警告。

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### sync

**签名：**
```typescript
sync: Composition['inheritLocale'];
```

**详情**

是否将根级别的语言环境同步到组件本地化语言环境。

**另请参阅**
- [本地作用域](../../guide/essentials/scope#local-scope-2)

### t

语言环境消息翻译

**签名：**
```typescript
t: VueI18nTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [VueI18nTranslation](legacy#vuei18ntranslation)

### tm

语言环境消息获取器

**签名：**
```typescript
tm: Composition['tm'];
```

**详情**

如果指定了 [i18n component options](injection#i18n)，则优先在本地作用域语言环境消息中获取，而不是全局作用域语言环境消息。

如果未指定 [i18n component options](injection#i18n)，则使用全局作用域语言环境消息获取。

基于当前 `locale`，将从 Composer 实例消息返回语言环境消息。

如果您更改 `locale`，返回的语言环境消息也将对应于该语言环境。

如果 Composer 实例消息中没有给定 `key` 的语言环境消息，则将通过[回退](../../guide/essentials/fallback)返回。

:::warning
您需要对 `tm` 返回的语言环境消息使用 `rt`。请参阅 [rt](legacy#rt-message) 详细信息。
:::

**示例**

template:
```html
<div class="container">
  <template v-for="content in $tm('contents')">
    <h2>{{ $rt(content.title) }}</h2>
    <p v-for="paragraph in content.paragraphs">
     {{ $rt(paragraph) }}
    </p>
  </template>
</div>
```


```js
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  messages: {
    en: {
      contents: [
        {
          title: 'Title1',
          // ...
          paragraphs: [
            // ...
          ]
        }
      ]
    }
  }
  // ...
})
```




### warnHtmlInMessage

**签名：**
```typescript
warnHtmlInMessage: WarnHtmlInMessageLevel;
```

**详情**

是否允许使用 HTML 格式的语言环境消息。

如果设置为 `warn` 或 `error`，将在 VueI18n 实例上检查语言环境消息。

如果指定为 `warn`，将在控制台输出警告。

如果指定为 `error`，将发生错误。

**另请参阅**
- [HTML 消息](../../guide/essentials/syntax#html-message)
- [更改 `warnHtmlInMessage` 选项默认值](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### te(key, locale)

翻译语言环境消息是否存在

**签名：**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**详情**

VueI18n 实例 [messages](legacy#messages) 上是否存在语言环境消息。

如果您指定了 `locale`，则检查 `locale` 的语言环境消息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Str &#124; Key | 目标语言环境消息键 |
| locale | Locales | 目标语言环境 |

#### 返回值

如果找到语言环境消息，则为 `true`，否则为 `false`

## VueI18nDateTimeFormatting

VueI18n 传统接口的日期时间格式化函数

**签名：**
```typescript
export interface VueI18nDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

这是 [VueI18n](legacy#vuei18n) 的接口

### (value: number | Date): DateTimeFormatResult;

日期时间格式化

**签名：**
```typescript
(value: number | Date): DateTimeFormatResult;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果指定了 [i18n component options](injection#i18n)，则优先在本地作用域日期时间格式中格式化，而不是全局作用域语言环境消息。

如果未指定 [i18n component options](injection#i18n)，则使用全局作用域日期时间格式进行格式化。

**另请参阅**
- [日期时间格式化](../../guide/essentials/datetime)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number &#124; Date | 值，时间戳数字或 `Date` 实例 |

#### 返回值

格式化后的值

### (value: Value, key: Key | ResourceKeys): DateTimeFormatResult;

日期时间格式化

**签名：**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys): DateTimeFormatResult;
```

**详情**

重载的 `d`。关于详细信息，请参阅 [调用签名](legacy#value-number-date-datetimeformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | Value | 值，时间戳数字或 `Date` 实例 |
| key | Key &#124; ResourceKeys | 日期时间格式的键 |

#### 返回值

格式化后的值

### (value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;

日期时间格式化

**签名：**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;
```

**详情**

重载的 `d`。关于详细信息，请参阅 [调用签名](legacy#value-number-date-datetimeformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | Value | 值，时间戳数字或 `Date` 实例 |
| key | Key &#124; ResourceKeys | 日期时间格式的键 |
| locale | Locales | 语言环境，它将优先于全局作用域或本地作用域使用。 |

#### 返回值

格式化后的值

### (value: number | Date, args: {        [key: string]: string | boolean | number;    }): DateTimeFormatResult;

日期时间格式化

**签名：**
```typescript
(value: number | Date, args: {
        [key: string]: string | boolean | number;
    }): DateTimeFormatResult;
```

**详情**

重载的 `d`。关于详细信息，请参阅 [调用签名](legacy#value-number-date-datetimeformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number &#124; Date | 值，时间戳数字或 `Date` 实例 |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | 参数值 |

#### 返回值

格式化后的值

## VueI18nNumberFormatting

VueI18n 传统接口的数字格式化函数

**签名：**
```typescript
export interface VueI18nNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

这是 [VueI18n](legacy#vuei18n) 的接口

### (value: number): NumberFormatResult;

数字格式化

**签名：**
```typescript
(value: number): NumberFormatResult;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果指定了 [i18n component options](injection#i18n)，则优先在本地作用域数字格式中格式化，而不是全局作用域语言环境消息。

如果未指定 [i18n component options](injection#i18n)，则使用全局作用域数字格式进行格式化。

**另请参阅**
- [数字格式化](../../guide/essentials/number)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |

#### 返回值

格式化后的值

### (value: number, key: Key | ResourceKeys): NumberFormatResult;

数字格式化

**签名：**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys): NumberFormatResult;
```

**详情**

重载的 `n`。关于详细信息，请参阅 [调用签名](legacy#value-number-numberformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | Key &#124; ResourceKeys | 数字格式的键 |

#### 返回值

格式化后的值

### (value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;

数字格式化

**签名：**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;
```

**详情**

重载的 `n`。关于详细信息，请参阅 [调用签名](legacy#value-number-numberformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | Key &#124; ResourceKeys | 数字格式的键 |
| locale | Locales | 语言环境，它将优先于全局作用域或本地作用域使用。 |

#### 返回值

格式化后的值

### (value: number, args: {        [key: string]: string | boolean | number;    }): NumberFormatResult;

数字格式化

**签名：**
```typescript
(value: number, args: {
        [key: string]: string | boolean | number;
    }): NumberFormatResult;
```

**详情**

重载的 `n`。关于详细信息，请参阅 [调用签名](legacy#value-number-numberformatresult) 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | 参数值 |

#### 返回值

格式化后的值

## VueI18nOptions

VueI18n 选项

**签名：**
```typescript
export interface VueI18nOptions<Schema extends {
    message?: unknown;
    datetime?: unknown;
    number?: unknown;
} = {
    message: DefaultLocaleMessageSchema;
    datetime: DefaultDateTimeFormatSchema;
    number: DefaultNumberFormatSchema;
}, Locales extends {
    messages: unknown;
    datetimeFormats: unknown;
    numberFormats: unknown;
} | string = Locale, Options extends ComposerOptions<Schema, Locales> = ComposerOptions<Schema, Locales>>
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

此选项与 `VueI18n` 类构造函数选项（Vue I18n v8.x 提供）兼容

### availableLocales

**签名：**
```typescript
availableLocales?: Locale[];
```

**详情**

消息中可用语言环境的列表，按词法顺序排列。

**默认值**

`[]`

### datetime

### datetimeFormats

### escapeParameterHtml

**签名：**
```typescript
escapeParameterHtml?: Options['escapeParameter'];
```

**详情**

是否转义列表或命名插值值的参数。启用时，此选项： - 转义插值参数中的 HTML 特殊字符（`<`、`>`、`"`、`'`、`&`、`/`、`=`） - 净化最终翻译的 HTML 以防止 XSS 攻击，方法是： - 转义 HTML 属性值中的危险字符 - 中和事件处理程序属性（onclick、onerror 等） - 禁用 href、src、action、formaction 和 style 属性中的 javascript: URL

当翻译输出在 `v-html` 中使用且翻译资源包含 html 标记（例如围绕用户提供的值）时，这很有用。

这种用法模式主要发生在将预先计算的文本字符串传递到 UI 组件时。

转义过程涉及将以下符号替换为其各自的 HTML 字符实体：`<`、`>`、`"`、`'`。

将 `escapeParameterHtml` 设置为 true 不应破坏现有功能，但可以防止一种微妙的 XSS 攻击向量。

**默认值**

`false`

**另请参阅**
- [HTML 消息 - 使用 escapeParameter 选项](../../guide/essentials/syntax#using-the-escapeparameter-option)

### fallbackLocale

**签名：**
```typescript
fallbackLocale?: Options['fallbackLocale'];
```

**详情**

回退本地化的语言环境。

有关更复杂的回退定义，请参阅 fallback。

**默认值**

如果未指定，则默认为 `locale` 的 `'en-US'`，或者是 `locale` 值

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### fallbackRoot

**签名：**
```typescript
fallbackRoot?: Options['fallbackRoot'];
```

**详情**

在组件本地化中，本地化失败时是否回退到根级别（全局作用域）本地化。

如果 `false`，则不回退到根。

**默认值**

`true`

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### flatJson

**签名：**
```typescript
flatJson?: Options['flatJson'];
```

**详情**

是否允许使用扁平 json 消息

**默认值**

`false`

### formatFallbackMessages

**签名：**
```typescript
formatFallbackMessages?: Options['fallbackFormat'];
```

**详情**

当回退到 `fallbackLocale` 或 root 时是否禁止警告。

**默认值**

`false`

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### locale

**签名：**
```typescript
locale?: Options['locale'];
```

**详情**

本地化的语言环境。

如果语言环境包含地域和方言，则此语言环境包含隐式回退。

**默认值**

`'en-US'`

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)

### message

### messageResolver

**签名：**
```typescript
messageResolver?: MessageResolver;
```

**详情**

用于解析 [`messages`](legacy#messages) 的消息解析器。

如果未指定，将默认使用 vue-i18n 内部消息解析器。

您需要自己实现支持以下要求的消息解析器：

- 使用作为消息解析器第一个参数传递的 [`locale`](legacy#locale) 的语言环境消息，以及作为第二个参数传递的路径来解析消息。

- 如果无法解析消息，您需要返回 `null`。

- 如果您将返回 `null`，如果启用了 [`fallbackLocale`](legacy#fallbacklocale-2)，消息解析器也将在回退时被调用，因此也需要解析消息。

消息解析器由以下 API 间接调用：

- [`t`](legacy#t-key)

- [`te`](legacy#te-key-locale)

- [`tm`](legacy#tm-key)

- [Translation 组件](component#translation)

:::tip
:new: v9.2+
:::

:::warning
如果您使用消息解析器，[`flatJson`](legacy#flatjson) 设置将被忽略。也就是说，您需要自己解析扁平 JSON。
:::

**默认值**

`undefined`

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

**示例**

这是一个如何使用您的 `createI18n` 设置它的示例：
```js
import { createI18n } from 'vue-i18n'

// 您的消息解析器
function messageResolver(obj, path) {
  // 简单的消息解析！
  const msg = obj[path]
  return msg != null ? msg : null
}

// 使用 I18n 选项调用
const i18n = createI18n({
  locale: 'ja',
  messageResolver, // 设置您的消息解析器
  messages: {
    en: { ... },
    ja: { ... }
  }
})

// 下面是您要做的事情 ...
// ...
```




### messages

### missing

**签名：**
```typescript
missing?: Options['missing'];
```

**详情**

本地化缺失的处理程序。

该处理程序会在调用时获取本地化目标语言环境、本地化路径键、Vue 实例和值。

如果分配了缺失处理程序，并且发生了本地化缺失，则不会发出警告。

**默认值**

`null`

### modifiers

**签名：**
```typescript
modifiers?: Options['modifiers'];
```

**详情**

链接消息的自定义修饰符。

**另请参阅**
- [自定义修饰符](../../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralizationRules

**签名：**
```typescript
pluralizationRules?: Options['pluralRules'];
```

**详情**

一组单词复数化规则

**默认值**

`{}`

**另请参阅**
- [自定义复数化](../../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**签名：**
```typescript
postTranslation?: Options['postTranslation'];
```

**详情**

翻译后处理的处理程序。该处理程序在调用 `$t` 和 `t` 后获取。

如果您想过滤翻译后的文本（例如修剪空格），此处理程序很有用。

**默认值**

`null`

### sharedMessages

**签名：**
```typescript
sharedMessages?: LocaleMessages<VueMessageType>;
```

**详情**

组件本地化的共享语言环境消息。更多详细信息请参阅基于组件的本地化。

**默认值**

`undefined`

**另请参阅**
- [组件的共享语言环境消息](../../guide/essentials/local#shared-locale-messages-for-components)

### silentFallbackWarn

**签名：**
```typescript
silentFallbackWarn?: Options['fallbackWarn'];
```

**详情**

当您的语言缺少键的翻译时，是否在翻译键上进行模板插值。

如果 `true`，则跳过为您的“基础”语言编写模板；键就是您的模板。

**默认值**

`false`

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### silentTranslationWarn

**签名：**
```typescript
silentTranslationWarn?: Options['missingWarn'];
```

**详情**

本地化失败时是否禁止输出警告。

如果 `true`，则禁止本地化失败警告。

如果您使用正则表达式，您可以禁止与翻译键（例如 `t`）匹配的本地化失败警告。

**默认值**

`false`

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### sync

**签名：**
```typescript
sync?: boolean;
```

**详情**

是否将根级别的语言环境同步到组件本地化语言环境。

如果 `false`，无论根级别语言环境如何，都为每个组件语言环境进行本地化。

**默认值**

`true`

**另请参阅**
- [本地作用域](../../guide/essentials/scope#local-scope-2)

### warnHtmlInMessage

**签名：**
```typescript
warnHtmlInMessage?: WarnHtmlInMessageLevel;
```

**详情**

是否允许使用 HTML 格式的语言环境消息。

请参阅 warnHtmlInMessage 属性。

**默认值**

`'off'`

**另请参阅**
- [HTML 消息](../../guide/essentials/syntax#html-message)
- [更改 `warnHtmlInMessage` 选项默认值](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

## VueI18nResolveLocaleMessageTranslation

VueI18n 传统接口的解析语言环境消息翻译函数

**签名：**
```typescript
export type VueI18nResolveLocaleMessageTranslation<Locales = 'en-US'> = ComposerResolveLocaleMessageTranslation<Locales>;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

这是 [VueI18n](legacy#vuei18n) 的接口。此接口是 [ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation) 的别名。

## VueI18nTranslation

VueI18n 传统接口的语言环境消息翻译函数

**签名：**
```typescript
export interface VueI18nTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? PickupPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? PickupKeys<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

这是 [VueI18n](legacy#vuei18n) 的接口

### (key: Key | ResourceKeys): TranslateResult;

语言环境消息翻译。

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys): TranslateResult;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果指定了 [i18n component options](injection#i18n)，则优先在本地作用域语言环境消息中翻译，而不是全局作用域语言环境消息。

如果未指定 [i18n component options](injection#i18n)，则使用全局作用域语言环境消息进行翻译。

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, named: Record&lt;string, unknown&gt;): TranslateResult;

语言环境消息翻译。

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

**另请参阅**
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| named | Record&lt;string, unknown&gt; | 命名插值的值 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;

命名插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记，并返回复数化翻译消息。

**另请参阅**
- [复数化](../../guide/essentials/pluralization)
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;

命名插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记，如果未找到翻译，则返回默认消息。

**另请参阅**
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

命名插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions<Locales>): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

**另请参阅**
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, plural: number): TranslateResult;

复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，返回复数化翻译消息。

您也可以根据选项禁止警告，当缺少翻译时。

**另请参阅**
- [复数化](../../guide/essentials/pluralization)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, plural: number, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，返回复数化翻译消息。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

**另请参阅**
- [复数化](../../guide/essentials/pluralization)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, defaultMsg: string): TranslateResult;

缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，如果未找到翻译，则返回默认消息。

您也可以根据选项禁止警告，当缺少翻译时。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions<Locales>): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，如果未找到翻译，则返回默认消息。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, list: unknown[]): TranslateResult;

语言环境消息翻译。

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[]): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

**另请参阅**
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;

列表插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...，并返回复数化翻译消息。

**另请参阅**
- [复数化](../../guide/essentials/pluralization)
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;

列表插值和缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...，如果未找到翻译，则返回默认消息。

**另请参阅**
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### (key: Key | ResourceKeys, list: unknown[], options: TranslateOptions&lt;Locales&gt;): TranslateResult;

列表插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], options: TranslateOptions<Locales>): TranslateResult;
```

**详情**

重载的 `t`。关于详细信息，请参阅 [调用签名](legacy#key-key-resourcekeys-translateresult) 详细信息。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

**另请参阅**
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译消息

## WarnHtmlInMessageLevel

**签名：**
```typescript
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error';
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::
