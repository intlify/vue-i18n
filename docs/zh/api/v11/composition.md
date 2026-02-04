# 组合式 API

## Composer

Composer 接口

**签名：**
```typescript
export interface Composer<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends Locale ? IsNever<ResourceLocales> extends true ? Locale : ResourceLocales : OptionLocale | ResourceLocales> extends ComposerCustom
```

**详情**

这是用于 Vue 3 组合式 API 的接口。

### availableLocales

**签名：**
```typescript
readonly availableLocales: ComputedRef<Locales[]>;
```

**详情**

`messages` 中可用语言环境的列表，按词法顺序排列。

### d

日期时间格式化

**签名：**
```typescript
d: ComposerDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [ComposerDateTimeFormatting](composition#composerdatetimeformatting)

### datetimeFormats

**签名：**
```typescript
readonly datetimeFormats: ComputedRef<{
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    }>;
```

**详情**

本地化的日期时间格式。

参阅：
- [日期时间格式化](../../guide/essentials/datetime)

### escapeParameter

**签名：**
```typescript
escapeParameter: boolean;
```

**详情**

插值参数是否在消息翻译之前进行转义。

参阅：
- [HTML 消息](../../guide/essentials/syntax#html-message)

### fallbackFormat

**签名：**
```typescript
fallbackFormat: boolean;
```

**详情**

当回退到 `fallbackLocale` 或 root 时是否禁止警告。

参阅：
- [回退机制](../../guide/essentials/fallback)

### fallbackLocale

**签名：**
```typescript
fallbackLocale: WritableComputedRef<FallbackLocales<Locales>>;
```

**详情**

此 Composer 实例当前使用的回退语言环境。

参阅：
- [回退机制](../../guide/essentials/fallback)

### fallbackRoot

**签名：**
```typescript
fallbackRoot: boolean;
```

**详情**

本地化失败时是否回退到根级别（全局作用域）本地化。

参阅：
- [回退机制](../../guide/essentials/fallback)

### fallbackWarn

**签名：**
```typescript
fallbackWarn: boolean | RegExp;
```

**详情**

本地化失败时是否禁止回退警告。

参阅：
- [回退机制](../../guide/essentials/fallback)

### id

**签名：**
```typescript
id: number;
```

**详情**

实例 ID。

### inheritLocale

**签名：**
```typescript
inheritLocale: boolean;
```

**详情**

是否将根级别的语言环境继承到组件本地化语言环境。

参阅：
 - [本地作用域](../../guide/essentials/scope#local-scope-2)

### isGlobal

**签名：**
```typescript
readonly isGlobal: boolean;
```

**详情**

此 composer 实例是否为全局实例

### locale

**签名：**
```typescript
locale: WritableComputedRef<Locales>;
```

**详情**

此 Composer 实例当前使用的语言环境。

如果语言环境包含地域和方言，则此语言环境包含隐式回退。

参阅：
- [作用域和区域设置更改](../../guide/essentials/scope)

### messages

**签名：**
```typescript
readonly messages: ComputedRef<{
        [K in keyof Messages]: Messages[K];
    }>;
```

**详情**

本地化的语言环境消息。

参阅：
- [快速开始](../../guide/essentials/started)

### missingWarn

**签名：**
```typescript
missingWarn: boolean | RegExp;
```

**详情**

本地化失败时是否禁止输出警告。

参阅：
- [回退机制](../../guide/essentials/fallback)

### modifiers

**签名：**
```typescript
readonly modifiers: LinkedModifiers<VueMessageType>;
```

**详情**

链接消息的自定义修饰符。

参阅：
 - [自定义修饰符](../../guide/essentials/syntax#custom-modifiers)

### n

数字格式化

**签名：**
```typescript
n: ComposerNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [ComposerNumberFormatting](composition#composernumberformatting)

### numberFormats

**签名：**
```typescript
readonly numberFormats: ComputedRef<{
        [K in keyof NumberFormats]: NumberFormats[K];
    }>;
```

**详情**

本地化的数字格式。

参阅：
- [数字格式化](../../guide/essentials/number)

### pluralRules

**签名：**
```typescript
readonly pluralRules: PluralizationRules;
```

**详情**

一组单词复数化规则

参阅：
- [自定义复数化](../../guide/essentials/pluralization#custom-pluralization)

### rt

解析语言环境消息翻译

**签名：**
```typescript
rt: ComposerResolveLocaleMessageTranslation<Locales>;
```

**详情**

关于详细函数，请参阅 [ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation)

### t

语言环境消息翻译

**签名：**
```typescript
t: ComposerTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**详情**

关于详细函数，请参阅 [ComposerTranslation](composition#composertranslation)

### warnHtmlMessage

**签名：**
```typescript
warnHtmlMessage: boolean;
```

**详情**

是否允许使用 HTML 格式的语言环境消息。

如果设置为 `false`，将在 Composer 实例上检查语言环境消息。

如果指定为 `true`，将在控制台输出警告。

参阅：
- [HTML 消息](../../guide/essentials/syntax#html-message)
- [更改 `warnHtmlInMessage` 选项默认值](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### getDateTimeFormat(locale)

获取日期时间格式

**签名：**
```typescript
getDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Return = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema>(locale: LocaleSchema | Locale): Return;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| DateTimeSchema | 日期时间格式模式，默认为 `never` |

**详情**

从 Composer 实例获取日期时间格式。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |

#### 返回值

日期时间格式

### getLocaleMessage(locale)

获取语言环境消息

**签名：**
```typescript
getLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Return = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema>(locale: LocaleSchema | Locale): Return;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| MessageSchema | 语言环境消息模式，默认为 `never` |

**详情**

从 Composer 实例获取语言环境消息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |

#### 返回值

语言环境消息

### getMissingHandler()

获取缺失处理程序

**签名：**
```typescript
getMissingHandler(): MissingHandler | null;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |

#### 返回值

[MissingHandler](composition#missinghandler)

### getNumberFormat(locale)

获取数字格式

**签名：**
```typescript
getNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Return = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema>(locale: LocaleSchema | Locale): Return;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| NumberSchema | 数字格式模式，默认为 `never` |

**详情**

从 Composer 实例获取数字格式。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |

#### 返回值

数字格式

### getPostTranslationHandler()

获取翻译后处理程序

**签名：**
```typescript
getPostTranslationHandler(): PostTranslationHandler<VueMessageType> | null;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |

#### 返回值



### mergeDateTimeFormat(locale, format)

合并日期时间格式

**签名：**
```typescript
mergeDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Formats = IsNever<DateTimeSchema> extends true ? Record<string, any> : DateTimeSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| DateTimeSchema | 日期时间格式模式，默认为 `never` |

**详情**

将日期时间格式合并到 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| format | Formats | 目标日期时间格式 |

### mergeLocaleMessage(locale, message)

合并语言环境消息

**签名：**
```typescript
mergeLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Message = IsNever<MessageSchema> extends true ? Record<string, any> : MessageSchema>(locale: LocaleSchema | Locale, message: Message): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| MessageSchema | 语言环境消息模式，默认为 `never` |

**详情**

将语言环境消息合并到 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| message | Message | 消息 |

### mergeNumberFormat(locale, format)

合并数字格式

**签名：**
```typescript
mergeNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Formats = IsNever<NumberSchema> extends true ? Record<string, any> : NumberSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| NumberSchema | 数字格式模式，默认为 `never` |

**详情**

将数字格式合并到 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| format | Formats | 目标数字格式 |

### setDateTimeFormat(locale, format)

设置日期时间格式

**签名：**
```typescript
setDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, FormatsType = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| DateTimeSchema | 日期时间格式模式，默认为 `never` |

**详情**

将日期时间格式设置为 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| format | Formats | 目标日期时间格式 |

### setLocaleMessage(locale, message)

设置语言环境消息

**签名：**
```typescript
setLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, MessageType = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema, Message extends MessageType = MessageType>(locale: LocaleSchema | Locale, message: Message): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| MessageSchema | 语言环境消息模式，默认为 `never` |

**详情**

将语言环境消息设置为 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| message | Message | 消息 |

### setMissingHandler(handler)

设置缺失处理程序

**签名：**
```typescript
setMissingHandler(handler: MissingHandler | null): void;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| handler | MissingHandler &#124; null | [MissingHandler](composition#missinghandler) |

### setNumberFormat(locale, format)

设置数字格式

**签名：**
```typescript
setNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, FormatsType = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 类型参数

| 参数 | 描述 |
| --- | --- |
| NumberSchema | 数字格式模式，默认为 `never` |

**详情**

将数字格式设置为 Composer 实例。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | 目标语言环境 |
| format | Formats | 目标数字格式 |

### setPostTranslationHandler(handler)

设置翻译后处理程序

**签名：**
```typescript
setPostTranslationHandler(handler: PostTranslationHandler<VueMessageType> | null): void;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| handler | PostTranslationHandler&lt;VueMessageType&gt; &#124; null |  |

### te(key, locale)

翻译语言环境消息是否存在

**签名：**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**详情**

Composer 实例上是否存在语言环境消息。

如果您指定了 `locale`，则检查 `locale` 的语言环境消息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Str &#124; Key | 目标语言环境消息键 |
| locale | Locales | 语言环境，它将优先于全局作用域或本地作用域使用 |

#### 返回值

如果找到语言环境消息，则为 `true`，否则为 `false`。请注意，即使键中存在的值不可翻译，也会返回 `false`；但如果 `translateExistCompatible` 设置为 `true`，只要键可用，即使值不可翻译，也会返回 `true`。

### tm(key)

语言环境消息获取器

**签名：**
```typescript
tm<Key extends string, ResourceKeys extends PickupKeys<Messages> = PickupKeys<Messages>, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Target = IsEmptyObject<Messages> extends false ? NonNullable<Messages>[Locale] : RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>, Return = ResourceKeys extends ResourcePath<Target> ? ResourceValue<Target, ResourceKeys> : Record<string, any>>(key: Key | ResourceKeys): Return;
```

**详情**

如果在 `useI18n` 中指定了 [I18nScope](general#i18nscope) `'local'` 或某些 [UseI18nOptions](composition#usei18noptions)，则优先在本地作用域语言环境消息中翻译，而不是全局作用域语言环境消息。

基于当前 `locale`，将从 Composer 实例消息返回语言环境消息。

如果您更改 `locale`，返回的语言环境消息也将对应于该语言环境。

如果 Composer 实例消息中没有给定 `key` 的语言环境消息，则将通过[回退](../../guide/essentials/fallback)返回。

 [!WARNING]  您需要对 `tm` 返回的语言环境消息使用 `rt`。请参阅 `rt` 详细信息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | 目标语言环境消息键 |

#### 返回值

语言环境消息

**示例**

template 块：
```html
<div class="container">
  <template v-for="content in tm('contents')">
    <h2>{{ rt(content.title) }}</h2>
    <p v-for="paragraph in content.paragraphs">
     {{ rt(paragraph) }}
    </p>
  </template>
</div>
```

script 块：
```js
import { defineComponent } from 'vue
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { rt, tm } = useI18n({
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
    // ...
    return { ... , rt, tm }
  }
})
```




## ComposerAdditionalOptions

`useI18n` 的 Composer 附加选项

**签名：**
```typescript
export interface ComposerAdditionalOptions
```

**详情**

`ComposerAdditionalOptions` 扩展了 [ComposerOptions](composition#composeroptions)，因此您可以指定这些选项。

### useScope

## ComposerCustom

Composer 的自定义类型定义

**签名：**
```typescript
export interface ComposerCustom
```

**详情**

可以扩展 Composer 的接口。

由第三方（例如 nuxt/i18n）定义的类型

**示例**


```ts
// vue-i18n.d.ts (您应用中的 `.d.ts` 文件)

declare module 'vue-i18n' {
  interface ComposerCustom {
    localeCodes: string[]
  }
}
```




## ComposerDateTimeFormatting

日期时间格式化函数

**签名：**
```typescript
export interface ComposerDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**详情**

这是 [Composer](composition#composer) 的接口

### (value: number | Date | string): string;

日期时间格式化

**签名：**
```typescript
(value: number | Date | string): string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果在 `useI18n` 中指定了 `'local'` 或某些 [UseI18nOptions](composition#usei18noptions)，则优先在本地作用域日期时间格式中翻译，而不是全局作用域日期时间格式。

如果不是，则使用全局作用域日期时间格式进行格式化。

参阅：
- [日期时间格式化](../../guide/essentials/datetime)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number &#124; Date &#124; string | 值，时间戳数字或 `Date` 实例或 ISO 8601 字符串 |

#### 返回值

格式化后的值

### (value: Value, keyOrOptions: OptionsType): IsPart&lt;OptionsType&gt; extends true ? Intl.DateTimeFormatPart[] : string;

日期时间格式化

**签名：**
```typescript
<Value extends number | Date | string = number, Key extends string = string, OptionsType extends Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>>(value: Value, keyOrOptions: OptionsType): IsPart<OptionsType> extends true ? Intl.DateTimeFormatPart[] : string;
```

**详情**

重载的 `d`。

在此重载的 `d` 中，使用在日期时间格式中注册的键的日期时间格式进行格式化。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | Value | 值，时间戳数字或 `Date` 实例或 ISO 8601 字符串 |
| keyOrOptions | OptionsType | 日期时间格式的键，或日期时间格式化的附加选项 |

#### 返回值

格式化后的值

### (value: Value, keyOrOptions: OptionsType, locale: Locales): IsPart&lt;OptionsType&gt; extends true ? Intl.DateTimeFormatPart[] : string;

日期时间格式化

**签名：**
```typescript
<Value extends number | Date | string = number, Key extends string = string, OptionsType extends Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>>(value: Value, keyOrOptions: OptionsType, locale: Locales): IsPart<OptionsType> extends true ? Intl.DateTimeFormatPart[] : string;
```

**详情**

重载的 `d`。

在此重载的 `d` 中，使用目标语言环境的日期时间格式中注册的键的日期时间格式进行格式化

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | Value | 值，时间戳数字或 `Date` 实例或 ISO 8601 字符串 |
| keyOrOptions | OptionsType | 日期时间格式的键，或日期时间格式化的附加选项 |
| locale | Locales | 语言环境，它将优先于全局作用域或本地作用域使用。 |

#### 返回值

格式化后的值

## ComposerNumberFormatting

数字格式化函数

**签名：**
```typescript
export interface ComposerNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**详情**

这是 [Composer](composition#composer) 的接口

### (value: number): string;

数字格式化

**签名：**
```typescript
(value: number): string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果在 `useI18n` 中指定了 `'local'` 或某些 [UseI18nOptions](composition#usei18noptions)，则优先在本地作用域数字格式中翻译，而不是全局作用域数字格式。

如果不是，则使用全局作用域数字格式进行格式化。

参阅：
- [数字格式化](../../guide/essentials/number)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |

#### 返回值

格式化后的值

### (value: number, keyOrOptions: OptionsType): IsPart&lt;OptionsType&gt; extends true ? Intl.NumberFormatPart[] : string;

数字格式化

**签名：**
```typescript
<Key extends string = string, OptionsType extends Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>>(value: number, keyOrOptions: OptionsType): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string;
```

**详情**

重载的 `n`。

在此重载的 `n` 中，使用在数字格式中注册的键的数字格式进行格式化。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| keyOrOptions | OptionsType | 数字格式的键，或数字格式化的附加选项 |

#### 返回值

格式化后的值

### (value: number, keyOrOptions: OptionsType, locale: Locales): IsPart&lt;OptionsType&gt; extends true ? Intl.NumberFormatPart[] : string;

数字格式化

**签名：**
```typescript
<Key extends string = string, OptionsType extends Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>>(value: number, keyOrOptions: OptionsType, locale: Locales): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string;
```

**详情**

重载的 `n`。

在此重载的 `n` 中，使用目标语言环境的数字格式中注册的键的数字格式进行格式化。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| keyOrOptions | OptionsType | 数字格式的键，或数字格式化的附加选项 |
| locale | Locales | 语言环境，它将优先于全局作用域或本地作用域使用。 |

#### 返回值

格式化后的值

## ComposerOptions

Composer 选项

**签名：**
```typescript
export interface ComposerOptions<Schema extends {
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
} | string = Locale, MessagesLocales = Locales extends {
    messages: infer M;
} ? M : Locales extends string ? Locales : Locale, DateTimeFormatsLocales = Locales extends {
    datetimeFormats: infer D;
} ? D : Locales extends string ? Locales : Locale, NumberFormatsLocales = Locales extends {
    numberFormats: infer N;
} ? N : Locales extends string ? Locales : Locale, MessageSchema = Schema extends {
    message: infer M;
} ? M : DefaultLocaleMessageSchema, DateTimeSchema = Schema extends {
    datetime: infer D;
} ? D : DefaultDateTimeFormatSchema, NumberSchema = Schema extends {
    number: infer N;
} ? N : DefaultNumberFormatSchema, _Messages extends LocaleMessages<MessageSchema, MessagesLocales, VueMessageType> = LocaleMessages<MessageSchema, MessagesLocales, VueMessageType>, _DateTimeFormats extends DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales> = DateTimeFormatsType<DateTimeSchema, DateTimeFormatsLocales>, _NumberFormats extends NumberFormatsType<NumberSchema, NumberFormatsLocales> = NumberFormatsType<NumberSchema, NumberFormatsLocales>>
```

**详情**

这是创建 composer 的选项。

### datetime

### datetimeFormats

### escapeParameter

**签名：**
```typescript
escapeParameter?: boolean;
```

**详情**

如果 `escapeParameter` 配置为 true，则插值参数在消息翻译之前进行转义。

当翻译输出在 `v-html` 中使用且翻译资源包含 html 标记（例如围绕用户提供的值）时，这很有用。

这种用法模式主要发生在将预先计算的文本字符串传递到 UI 组件时。

转义过程涉及将以下符号替换为其各自的 HTML 字符实体：`<`、`>`、`"`、`'`。

将 `escapeParameter` 设置为 true 不应破坏现有功能，但可以防止一种微妙的 XSS 攻击向量。

参阅：
- [HTML 消息](../../guide/essentials/syntax#html-message)

 `false`

### fallbackFormat

**签名：**
```typescript
fallbackFormat?: boolean;
```

**详情**

当您的语言缺少键的翻译时，是否在翻译键上进行模板插值。

如果 `true`，则跳过为您的“基础”语言编写模板；键就是您的模板。

参阅：
- [回退机制](../../guide/essentials/fallback)

 `false`

### fallbackLocale

**签名：**
```typescript
fallbackLocale?: FallbackLocale;
```

**详情**

回退本地化的语言环境。

有关更复杂的回退定义，请参阅 fallback。

参阅：
- [回退机制](../../guide/essentials/fallback)

 如果未指定，则默认为 `locale` 的 `'en-US'`，或者是 `locale` 值

### fallbackRoot

**签名：**
```typescript
fallbackRoot?: boolean;
```

**详情**

在组件本地化中，本地化失败时是否回退到根级别（全局作用域）本地化。

如果 `false`，则不回退到根。

参阅：
- [回退机制](../../guide/essentials/fallback)

 `true`

### fallbackWarn

**签名：**
```typescript
fallbackWarn?: boolean | RegExp;
```

**详情**

当回退到 `fallbackLocale` 或 root 时是否禁止警告。

如果 `false`，则禁止回退警告。

如果您使用正则表达式，您可以禁止与翻译键（例如 `t`）匹配的回退警告。

参阅：
- [回退机制](../../guide/essentials/fallback)

 `true`

### flatJson

**签名：**
```typescript
flatJson?: boolean;
```

**详情**

是否允许使用扁平 json 消息

 `false`

### inheritLocale

**签名：**
```typescript
inheritLocale?: boolean;
```

**详情**

是否将根级别的语言环境继承到组件本地化语言环境。

如果 `false`，无论根级别语言环境如何，都为每个组件语言环境进行本地化。

参阅：
- [本地作用域](../../guide/essentials/scope#local-scope-2)

 `true`

### locale

**签名：**
```typescript
locale?: Locale;
```

**详情**

本地化的语言环境。

如果语言环境包含地域和方言，则此语言环境包含隐式回退。

参阅：
- [作用域和区域设置更改](../../guide/essentials/scope)

 `'en-US'`

### message

### messageCompiler

**签名：**
```typescript
messageCompiler?: MessageCompiler;
```

**详情**

自定义消息格式的编译器。

如果未指定，将使用 vue-i18n 默认消息编译器。

您需要实现自己的返回消息函数的消息编译器

**示例**

这是一个如何使用 `intl-messageformat` 自定义消息编译器的示例
```js
import { createI18n } from 'vue-i18n'
import IntlMessageFormat from 'intl-messageformat'

function messageCompiler(message, { locale, key, onError }) {
  if (typeof message === 'string') {
    // 您可以在此处通过缓存策略或记忆化来调整消息编译器的性能
    const formatter = new IntlMessageFormat(message, locale)
    return ctx => formatter.format(ctx.values)
  } else {
    // 如果您想支持 AST，
    // 您需要使用 bundle 插件转换语言环境消息，例如 `json`、`yaml` 等。
    onError && onError(new Error('not support for AST'))
    return () => key // 返回默认的 `key`
  }
}

// 使用 I18n 选项调用
const i18n = createI18n({
  locale: 'ja',
  messageCompiler, // 设置您的消息编译器
  messages: {
    en: {
      hello: 'hello world!',
      greeting: 'hi, {name}!',
      // ICU 消息格式
      photo: `You have {numPhotos, plural,
        =0 {no photos.}
        =1 {one photo.}
        other {# photos.}
      }`
    },
  }
})

// 下面是您要做的事情 ...
// ...
```

 [!TIP] :new: v9.3+

 [!WARNING]  自定义消息格式是一项实验性功能。将来可能会收到重大更改或被删除。

参阅：
- [自定义消息格式](../../guide/advanced/format)

 `undefined`


### messageResolver

**签名：**
```typescript
messageResolver?: MessageResolver;
```

**详情**

用于解析消息的消息解析器。

如果未指定，将默认使用 vue-i18n 内部消息解析器。

您需要自己实现支持以下要求的消息解析器：

- 使用作为消息解析器第一个参数传递的语言环境消息，以及作为第二个参数传递的路径来解析消息。

- 如果无法解析消息，您需要返回 `null`。

- 如果您将返回 `null`，如果启用了回退，消息解析器也将在回退时被调用，因此也需要解析消息。

消息解析器由以下 API 间接调用：

-  -  -  -

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

 [!TIP]  :new: v9.2+

 [!WARNING]  如果您使用消息解析器，`flatJson` 设置将被忽略。也就是说，您需要自己解析扁平 JSON。

参阅：
- [回退机制](../../guide/essentials/fallback)

 `undefined`


### messages

### missing

**签名：**
```typescript
missing?: MissingHandler;
```

**详情**

本地化缺失的处理程序。

该处理程序会在调用时获取本地化目标语言环境、本地化路径键、Vue 实例和值。

如果分配了缺失处理程序，并且发生了本地化缺失，则不会发出警告。

 `null`

### missingWarn

**签名：**
```typescript
missingWarn?: boolean | RegExp;
```

**详情**

本地化失败时是否禁止输出警告。

如果 `false`，则禁止本地化失败警告。

如果您使用正则表达式，您可以禁止与翻译键（例如 `t`）匹配的本地化失败警告。

参阅：
- [回退机制](../../guide/essentials/fallback)

 `true`

### modifiers

**签名：**
```typescript
modifiers?: LinkedModifiers<VueMessageType>;
```

**详情**

链接消息的自定义修饰符。

参阅：
- [自定义修饰符](../../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralRules

**签名：**
```typescript
pluralRules?: PluralizationRules;
```

**详情**

一组单词复数化规则

参阅：
- [自定义复数化](../../guide/essentials/pluralization#custom-pluralization)

 `{}`

### postTranslation

**签名：**
```typescript
postTranslation?: PostTranslationHandler<VueMessageType>;
```

**详情**

翻译后处理的处理程序。

该处理程序在调用 `t` 后获取。

如果您想过滤翻译后的文本（例如修剪空格），此处理程序很有用。

 `null`

### warnHtmlMessage

**签名：**
```typescript
warnHtmlMessage?: boolean;
```

**详情**

是否允许使用 HTML 格式的语言环境消息。

请参阅 warnHtmlMessage 属性。

参阅：
- [HTML 消息](../../guide/essentials/syntax#html-message)
- [更改 `warnHtmlInMessage` 选项默认值](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

 `true`

## ComposerResolveLocaleMessageTranslation

解析语言环境消息翻译函数

**签名：**
```typescript
export interface ComposerResolveLocaleMessageTranslation<Locales = 'en-US'>
```

**详情**

这是 [Composer](composition#composer) 的接口

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType): string;

解析语言环境消息翻译

**签名：**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果在 `useI18n` 中指定了 `'local'` 或某些 [UseI18nOptions](composition#usei18noptions)，则优先在本地作用域语言环境消息中翻译，而不是全局作用域语言环境消息。

如果不是，则使用全局作用域语言环境消息进行翻译。

 [!TIP]  `rt` 的用例是使用 `tm`、`v-for`、javascript `for` 语句进行编程式语言环境消息翻译。

 [!WARNING]  `rt` 与 `t` 的不同之处在于它直接处理语言环境消息，而不是语言环境消息的键。`rt` 没有内部回退。您需要理解并使用 `tm` 返回的语言环境消息的结构。

参阅：
- [作用域和区域设置更改](../../guide/essentials/scope)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 要解析的目标语言环境消息。您需要指定 `tm` 返回的语言环境消息。 |

#### 返回值

翻译后的消息

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, plural: number, options?: TranslateOptions&lt;Locales&gt;): string;

解析复数的语言环境消息翻译

**签名：**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslateOptions<Locales>): string;
```

**详情**

重载的 `rt`。

在此重载的 `rt` 中，返回复数化翻译消息。

 [!TIP]  `rt` 的用例是使用 `tm`、`v-for`、javascript `for` 语句进行编程式语言环境消息翻译。

 [!WARNING]  `rt` 与 `t` 的不同之处在于它直接处理语言环境消息，而不是语言环境消息的键。`rt` 没有内部回退。您需要理解并使用 `tm` 返回的语言环境消息的结构。

参阅：
- [复数化](../../guide/essentials/pluralization)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 要解析的目标语言环境消息。您需要指定 `tm` 返回的语言环境消息。 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, list: unknown[], options?: TranslateOptions&lt;Locales&gt;): string;

解析列表插值的语言环境消息翻译

**签名：**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslateOptions<Locales>): string;
```

**详情**

重载的 `rt`。

在此重载的 `rt` 中，返回复数化翻译消息。

 [!TIP]  `rt` 的用例是使用 `tm`、`v-for`、javascript `for` 语句进行编程式语言环境消息翻译。

 [!WARNING]  `rt` 与 `t` 的不同之处在于它直接处理语言环境消息，而不是语言环境消息的键。`rt` 没有内部回退。您需要理解并使用 `tm` 返回的语言环境消息的结构。

参阅：
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 要解析的目标语言环境消息。您需要指定 `tm` 返回的语言环境消息。 |
| list | unknown[] | 列表插值的值。 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, named: NamedValue, options?: TranslateOptions&lt;Locales&gt;): string;

解析命名插值的语言环境消息翻译

**签名：**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslateOptions<Locales>): string;
```

**详情**

重载的 `rt`。

在此重载的 `rt` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记。

 [!TIP]  `rt` 的用例是使用 `tm`、`v-for`、javascript `for` 语句进行编程式语言环境消息翻译。

 [!WARNING]  `rt` 与 `t` 的不同之处在于它直接处理语言环境消息，而不是语言环境消息的键。`rt` 没有内部回退。您需要理解并使用 `tm` 返回的语言环境消息的结构。

参阅：
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 要解析的目标语言环境消息。您需要指定 `tm` 返回的语言环境消息。 |
| named | NamedValue | 命名插值的值。 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

## ComposerTranslation

语言环境消息翻译函数

**签名：**
```typescript
export interface ComposerTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? JsonPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? TranslationsPaths<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**详情**

这是 [Composer](composition#composer) 的接口

### (key: Key | ResourceKeys | number): string;

语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number): string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

如果在 `useI18n` 中指定了 [I18nScope](general#i18nscope) `'local'` 或某些 [UseI18nOptions](composition#usei18noptions)，则优先在本地作用域语言环境消息中翻译，而不是全局作用域语言环境消息。

如果不是，则使用全局作用域语言环境消息进行翻译。

参阅：
- [作用域和区域设置更改](../../guide/essentials/scope)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, named: NamedValue): string;

命名插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记。

您也可以根据选项禁止警告，当缺少翻译时。

参阅：
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;

命名插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记，并返回复数化翻译消息。

参阅：
- [复数化](../../guide/essentials/pluralization)
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;

命名插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记，如果未找到翻译，则返回默认消息。

参阅：
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): string;

命名插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions<Locales>): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，对于每个占位符 x，语言环境消息应包含 `{x}` 标记。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

如何使用详细信息：
- [命名插值](../../guide/essentials/syntax#named-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, plural: number): string;

复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，返回复数化翻译消息。

您也可以根据选项禁止警告，当缺少翻译时。

参阅：
- [复数化](../../guide/essentials/pluralization)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, plural: number, options: TranslateOptions&lt;Locales&gt;): string;

复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number, options: TranslateOptions<Locales>): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，返回复数化翻译消息。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

参阅：
- [复数化](../../guide/essentials/pluralization)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, defaultMsg: string): string;

缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，如果未找到翻译，则返回默认消息。

您也可以根据选项禁止警告，当缺少翻译时。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): string;

缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions<Locales>): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，如果未找到翻译，则返回默认消息。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, list: unknown[]): string;

列表插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[]): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...。

您也可以根据选项禁止警告，当缺少翻译时。

参阅：
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, list: unknown[], plural: number): string;

列表插值和复数的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], plural: number): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...，并返回复数化翻译消息。

参阅：
- [复数化](../../guide/essentials/pluralization)
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| plural | number | 获取哪个复数字符串。1 返回第一个。 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;

列表插值和缺失默认消息的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;
```

**详情**

重载的 `t`。

参阅：
- [列表插值](../../guide/essentials/syntax#list-interpolation)

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...，如果未找到翻译，则返回默认消息。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译后的消息

### (key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions&lt;Locales&gt;): string;

列表插值的语言环境消息翻译

**签名：**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions<Locales>): string;
```

**详情**

重载的 `t`。

在此重载的 `t` 中，语言环境消息应包含列表每个占位符的 `{0}`、`{1}`、...。

您也可以根据选项禁止警告，当缺少翻译时。

关于选项的详细信息，请参阅 。

如何使用详细信息：
- [列表插值](../../guide/essentials/syntax#list-interpolation)

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| options | TranslateOptions&lt;Locales&gt; | 翻译的附加选项 |

#### 返回值

翻译后的消息

## MissingHandler

**签名：**
```typescript
export type MissingHandler = (locale: Locale, key: Path, instance?: ComponentInternalInstance | GenericComponentInstance, type?: string) => string | void;
```

## useI18n

使用 Vue I18n 的组合式 API

**签名：**
```typescript
export declare function useI18n<Schema = DefaultLocaleMessageSchema, Locales = 'en-US', Options extends UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>>(options?: Options): Composer<NonNullable<Options['messages']>, NonNullable<Options['datetimeFormats']>, NonNullable<Options['numberFormats']>, NonNullable<Options['locale']>>;
```

### 类型参数

| 参数 | 描述 |
| --- | --- |
| Schema | i18n 资源（消息、日期时间格式、数字格式）模式，默认为  |
| Locales | i18n 资源模式的语言环境，默认为 `en-US` |

**详情**

此函数主要由 `setup` 使用。

如果指定了选项，则为每个组件创建 Composer 实例，您可以在组件上进行本地化。

如果未指定选项，您可以使用全局 Composer 进行本地化。

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | Options | 选项，请参阅 [UseI18nOptions](composition#usei18noptions) |

### 返回值

[Composer](composition#composer) 实例

**示例**

案例：组件资源基础本地化
```html
<template>
  <form>
    <label>{{ t('language') }}</label>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
  <p>message: {{ t('hello') }}</p>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
 setup() {
   const { t, locale } = useI18n({
     locale: 'ja',
     messages: {
       en: { ... },
       ja: { ... }
     }
   })
   // 做一些事情 ...

   return { ..., t, locale }
 }
}
</script>
```




## UseI18nOptions

`useI18n` 的 I18n 选项

**签名：**
```typescript
export type UseI18nOptions<Schema extends {
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
} | string = Locale, Options extends ComposerOptions<Schema, Locales> = ComposerOptions<Schema, Locales>> = ComposerAdditionalOptions & Options;
```

**详情**

`UseI18nOptions` 继承自 [ComposerAdditionalOptions](composition#composeradditionaloptions) 和 [ComposerOptions](composition#composeroptions)，因此您可以指定这些选项。

## VueMessageType

**签名：**
```typescript
export type VueMessageType = string | ResourceNode | VNode;
```
