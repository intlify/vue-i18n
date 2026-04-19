# 通用

## createI18n

Vue I18n 工厂函数

**签名：**
```typescript
export declare function createI18n<Schema extends object = DefaultLocaleMessageSchema, Locales extends string | object = 'en-US', Options extends I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>, Messages extends Record<string, unknown> = NonNullable<Options['messages']> extends Record<string, unknown> ? NonNullable<Options['messages']> : {}, DateTimeFormats extends Record<string, unknown> = NonNullable<Options['datetimeFormats']> extends Record<string, unknown> ? NonNullable<Options['datetimeFormats']> : {}, NumberFormats extends Record<string, unknown> = NonNullable<Options['numberFormats']> extends Record<string, unknown> ? NonNullable<Options['numberFormats']> : {}, OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale>(options: Options): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>;
```

### 类型参数

| 参数 | 描述 |
| --- | --- |
| Schema | i18n 资源（消息、日期时间格式、数字格式）模式，默认为  |
| Locales | i18n 资源模式的语言环境，默认为 `en-US` |

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| options | Options | 选项，请参阅 [I18nOptions](general#i18noptions) |

### 返回值

[I18n](general#i18n) 实例

另请参阅：
- [快速开始](../../guide/essentials/started)
- [组合式 API](../../guide/advanced/composition)

**示例**


```js
import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

// 使用 I18n 选项调用
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: { ... },
    ja: { ... }
  }
})

const App = {
  setup() {
    // ...
    const { t } = useI18n({ ... })
    return { ... , t }
  }
}

const app = createApp(App)

// 安装！
app.use(i18n)
app.mount('#app')
```




## DefineDateTimeFormat

日期时间格式的类型定义

**签名：**
```typescript
export interface DefineDateTimeFormat extends DateTimeFormat
```

**详情**

此类型别名用于严格定义日期时间格式的类型。

此定义的类型可以在全局范围内使用。

**示例**


```ts
// type.d.ts (您应用中的 `.d.ts` 文件)
import { DefineDateTimeFormat } from 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric'
      timezone: string
    }
  }
}
```




## DefineLocaleMessage

语言环境消息的类型定义

**签名：**
```typescript
export interface DefineLocaleMessage extends LocaleMessage<VueMessageType>
```

**详情**

此类型别名用于严格定义语言环境消息的类型。

此定义的类型可以在全局范围内使用。

**示例**


```ts
// type.d.ts (您应用中的 `.d.ts` 文件)
import { DefineLocaleMessage } from 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    title: string
    menu: {
      login: string
    }
  }
}
```




## DefineNumberFormat

数字格式的类型定义

**签名：**
```typescript
export interface DefineNumberFormat extends NumberFormat
```

**详情**

此类型别名用于严格定义数字格式的类型。

此定义的类型可以在全局范围内使用。

**示例**


```ts
// type.d.ts (您应用中的 `.d.ts` 文件)
import { DefineNumberFormat } from 'vue-i18n'

declare module 'vue-i18n' {
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
```




## ExportedGlobalComposer

导出的全局 composer 实例

**签名：**
```typescript
export interface ExportedGlobalComposer
```

**详情**

此接口是[全局 composer](general#global)，提供的接口通过 `app.config.globalProperties` 注入到每个组件中。

### availableLocales

可用语言环境

**签名：**
```typescript
readonly availableLocales: Locale[];
```

**详情**

此属性是 `Composer#availableLocales` 的类代理属性。有关详细信息，请参阅

### fallbackLocale

回退语言环境

**签名：**
```typescript
fallbackLocale: FallbackLocale;
```

**详情**

此属性是 `Composer#fallbackLocale` 的类代理属性。有关详细信息，请参阅

### locale

语言环境

**签名：**
```typescript
locale: Locale;
```

**详情**

此属性是 `Composer#locale` 的类代理属性。有关详细信息，请参阅

## I18n

I18n 实例

**签名：**
```typescript
export interface I18n<Messages extends Record<string, unknown> = {}, DateTimeFormats extends Record<string, unknown> = {}, NumberFormats extends Record<string, unknown> = {}, OptionLocale = Locale>
```

**详情**

作为 Vue 插件安装所需的实例

### global

可访问全局 Composer 实例的属性

此属性的实例是**全局作用域**。

**签名：**
```typescript
readonly global: Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>;
```

### dispose()

释放全局作用域资源

**签名：**
```typescript
dispose(): void;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |

### install(app, options)

安装入口点

**签名：**
```typescript
install(app: App, ...options: unknown[]): void;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| app | App | 目标 Vue 应用实例 |
| options | unknown[] | 安装选项 |

## I18nAdditionalOptions

I18n 附加选项

**签名：**
```typescript
export interface I18nAdditionalOptions
```

**详情**

`I18nAdditionalOptions` 是用于插件安装和行为控制的特定 Vue I18n 配置选项。

### globalInjection

是否将全局属性和函数注入到每个组件中。

**签名：**
```typescript
globalInjection?: boolean;
```

**详情**

如果设置为 `true`，则前缀为 `$` 的属性和方法将注入到 Vue 组件中。

另请参阅：
- [隐式注入属性和函数](../../guide/advanced/composition#implicit-with-injected-properties-and-functions)
- 链接 ComponentCustomProperties

 `true`

## I18nOptions

`createI18n` 的 I18n 选项

**签名：**
```typescript
export type I18nOptions<Schema extends {
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
} | string = Locale, Options = ComposerOptions<Schema, Locales>> = I18nAdditionalOptions & Options;
```

## I18nPluginOptions

Vue I18n 插件选项

**签名：**
```typescript
export interface I18nPluginOptions
```

**详情**

使用 `app.use` 将 Vue I18n 安装为 Vue 插件时指定的选项。

### globalInstall

是否全局安装 Vue I18n 提供的组件

**签名：**
```typescript
globalInstall?: boolean;
```

**详情**

如果启用此选项，组件将在 `app.use` 时全局安装。

如果您想在 `import` 语法中手动安装，可以将其设置为 `false` 以便在需要时安装。

 `true`

## I18nScope

I18n 作用域

**签名：**
```typescript
export type I18nScope = 'local' | 'parent' | 'global';
```

## VERSION

Vue I18n 版本

**签名：**
```typescript
VERSION: string
```

**详情**

Semver 格式。与 package.json `version` 字段格式相同。

## DateTimeOptions

日期时间选项

**签名：**
```typescript
export interface DateTimeOptions<Key = string, Locales = Locale> extends Intl.DateTimeFormatOptions, LocaleOptions<Locales>
```

**详情**

日期时间格式化 API 的选项

### fallbackWarn

**签名：**
```typescript
fallbackWarn?: boolean;
```

**详情**

当您的语言缺少键的格式化时，是否对格式键进行解析

### key

**签名：**
```typescript
key?: Key;
```

**详情**

目标格式键

### missingWarn

**签名：**
```typescript
missingWarn?: boolean;
```

**详情**

是否禁止在本地化失败时输出警告

### part

**签名：**
```typescript
part?: boolean;
```

**详情**

是否使用 [Intel.DateTimeFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)

## DefineCoreLocaleMessage

`@intlify/core-base` 包的语言环境消息类型定义

**签名：**
```typescript
export interface DefineCoreLocaleMessage extends LocaleMessage<string>
```

**详情**

此类型别名用于严格定义语言环境消息的类型。

**示例**


```ts
// type.d.ts (您应用中的 `.d.ts` 文件)
import { DefineCoreLocaleMessage } from '@intlify/core-base'

declare module '@intlify/core-base' {
  export interface DefineCoreLocaleMessage {
    title: string
    menu: {
      login: string
    }
  }
}
```




## FallbackLocale

**签名：**
```typescript
export type FallbackLocale = Locale | Locale[] | {
    [locale in string]: Locale[];
} | false;
```

## fallbackWithLocaleChain

使用语言环境链回退

**签名：**
```typescript
export declare function fallbackWithLocaleChain<Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**详情**

使用回退链算法实现的回退语言环境函数。在 VueI18n 中默认使用。

**另请参阅**
- [回退机制](../../guide/essentials/fallback)

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| ctx | CoreContext&lt;Message&gt; | [上下文](#corecontext) |
| fallback | FallbackLocale | [回退语言环境](general#fallbacklocale) |
| start | Locale | 起始[语言环境](general#locale) |

### 返回值

回退语言环境

## fallbackWithSimple

使用简单实现回退

**签名：**
```typescript
export declare function fallbackWithSimple<Message = string>(_ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**详情**

使用简单回退算法实现的回退语言环境函数。

基本上，它返回 `fallbackLocale` props 中指定的值，并在 intlify 内部进行回退处理。

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| _ctx | CoreContext&lt;Message&gt; |  |
| fallback | FallbackLocale | [回退语言环境](general#fallbacklocale) |
| start | Locale | 起始[语言环境](general#locale) |

### 返回值

回退语言环境

## LinkedModifiers

**签名：**
```typescript
export type LinkedModifiers<T = string> = {
    [key: string]: LinkedModify<T>;
};
```

## Locale

**签名：**
```typescript
export type Locale = IsNever<GeneratedLocale> extends true ? string : GeneratedLocale;
```

## LocaleDetector

**签名：**
```typescript
export interface LocaleDetector<Args extends any[] = any[]>
```

### resolvedOnce

### (...args: Args): Locale | Promise&lt;Locale&gt;;

## LocaleFallbacker

语言环境回退器

**签名：**
```typescript
export type LocaleFallbacker = <Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale) => Locale[];
```

## LocaleMessage

**签名：**
```typescript
export type LocaleMessage<Message = string> = Record<string, LocaleMessageValue<Message>>;
```

## LocaleMessageDictionary

**签名：**
```typescript
export type LocaleMessageDictionary<T, Message = string> = {
    [K in keyof T]: LocaleMessageType<T[K], Message>;
};
```

## LocaleMessages

**签名：**
```typescript
export type LocaleMessages<Schema, Locales = Locale, _Message = string> = LocaleRecord<UnionToTuple<Locales>, Schema>;
```

## LocaleMessageType

**签名：**
```typescript
export type LocaleMessageType<T, Message = string> = T extends string ? string : T extends () => Promise<infer P> ? LocaleMessageDictionary<P, Message> : T extends (...args: infer Arguments) => any ? (...args: Arguments) => ReturnType<T> : T extends Record<string, unknown> ? LocaleMessageDictionary<T, Message> : T extends Array<T> ? {
    [K in keyof T]: T[K];
} : T;
```

## LocaleMessageValue

**签名：**
```typescript
export type LocaleMessageValue<Message = string> = LocaleMessageDictionary<any, Message> | string;
```

## LocaleOptions

**签名：**
```typescript
export interface LocaleOptions<Locales = Locale>
```

### locale

**签名：**
```typescript
locale?: Locales | LocaleDetector;
```

**详情**

本地化的语言环境

## MessageCompiler

消息编译器

**签名：**
```typescript
export type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

## MessageCompilerContext

将传递给消息编译器的上下文。

**签名：**
```typescript
export type MessageCompilerContext = Pick<CompileOptions, 'onError' | 'onCacheKey'> & {
    warnHtmlMessage?: boolean;
    key: string;
    locale: Locale;
};
```

## MessageContext

消息上下文。

**签名：**
```typescript
export interface MessageContext<T = string>
```

### type

由消息函数处理的消息类型。

**签名：**
```typescript
type: string;
```

**详情**

通常为 `text`，您需要在消息函数中返回 **string**。

### values

消息值。

**签名：**
```typescript
values: Record<string, unknown>;
```

**详情**

消息值是从翻译函数（如 `$t`、`t` 或 `translate`）传递的参数值。

**示例**

vue-i18n `$t` (或 `t`) 案例:
```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p> <!-- `{ name: 'DIO' }` 是消息值 -->
```

`@intlify/core` (`@intlify/core-base`) `translate` 案例:
```js
translate(context, 'foo.bar', ['dio']) // `['dio']` 是消息值
```




### linked(key, modifier)

解析链接消息。

**签名：**
```typescript
linked(key: Path, modifier?: string): MessageType<T>;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Path | 消息键 |
| modifier | string | 修饰符 |

#### 返回值

解析的消息。

### linked(key, modifier, type)

重载的 `linked`

**签名：**
```typescript
linked(key: Path, modifier?: string, type?: string): MessageType<T>;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Path | 消息键 |
| modifier | string | 修饰符 |
| type | string | 消息类型 |

#### 返回值

解析的消息。

### linked(key, options)

重载的 `linked`

**签名：**
```typescript
linked(key: Path, options?: LinkedOptions): MessageType<T>;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Path | 消息键 |
| options | LinkedOptions | [链接选项](#linkedoptions) |

#### 返回值

解析的消息。

### list(index)

从列表中解析消息值。

**签名：**
```typescript
list(index: number): unknown;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| index | number | 消息值的索引。 |

#### 返回值

解析的消息值。

**示例**


```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```




### named(key)

从命名中解析消息值。

**签名：**
```typescript
named(key: string): unknown;
```

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | string | 消息值的键。 |

#### 返回值

解析的消息值。

**示例**


```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```




### plural(messages)

使用复数索引解析消息。

**签名：**
```typescript
plural(messages: T[]): T;
```

**详情**

使用翻译函数通过复数索引进行解析。

#### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| messages | T[] | 使用翻译函数通过复数索引解析的消息。 |

#### 返回值

解析的消息。

**示例**


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




## MessageFunction

消息函数。

**签名：**
```typescript
export type MessageFunction<T = string> = MessageFunctionCallable | MessageFunctionInternal<T>;
```

## MessageFunctionReturn

**签名：**
```typescript
export type MessageFunctionReturn<T = string> = T extends string ? MessageType<T> : MessageType<T>[];
```

## MessageResolver

**签名：**
```typescript
export type MessageResolver = (obj: unknown, path: Path) => PathValue;
```

## NamedValue

**签名：**
```typescript
export type NamedValue<T = {}> = T & Record<string, unknown>;
```

## NumberOptions

数字选项

**签名：**
```typescript
export interface NumberOptions<Key = string, Locales = Locale> extends Intl.NumberFormatOptions, LocaleOptions<Locales>
```

**详情**

数字格式化 API 的选项

### fallbackWarn

**签名：**
```typescript
fallbackWarn?: boolean;
```

**详情**

当您的语言缺少键的格式化时，是否对格式键进行解析

### key

**签名：**
```typescript
key?: Key;
```

**详情**

目标格式键

### missingWarn

**签名：**
```typescript
missingWarn?: boolean;
```

**详情**

是否禁止在本地化失败时输出警告

### part

**签名：**
```typescript
part?: boolean;
```

**详情**

是否使用 [Intel.NumberFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)

## Path

**签名：**
```typescript
export type Path = string;
```

## PathValue

**签名：**
```typescript
export type PathValue = string | number | boolean | Function | null | {
    [key: string]: PathValue;
} | PathValue[];
```

## PluralizationRules

**签名：**
```typescript
export type PluralizationRules = {
    [locale: string]: PluralizationRule;
};
```

## PostTranslationHandler

**签名：**
```typescript
export type PostTranslationHandler<Message = string> = (translated: MessageFunctionReturn<Message>, key: string) => MessageFunctionReturn<Message>;
```

## registerLocaleFallbacker

注册语言环境回退器

**签名：**
```typescript
export declare function registerLocaleFallbacker(fallbacker: LocaleFallbacker): void;
```

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| fallbacker | LocaleFallbacker | [LocaleFallbacker](general#localefallbacker) 函数 |

## registerMessageResolver

注册消息解析器

**签名：**
```typescript
export declare function registerMessageResolver(resolver: MessageResolver): void;
```

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| resolver | MessageResolver | [MessageResolver](general#messageresolver) 函数 |

## resolveValue

消息解析器

**签名：**
```typescript
export declare function resolveValue(obj: unknown, path: Path): PathValue;
```

**详情**

解析消息。可以解析具有层次结构（如对象）的消息。此解析器在 VueI18n 中默认使用。

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| obj | unknown | 要通过路径解析的目标对象 |
| path | Path | 用于解析消息值的[路径](general#path) |

### 返回值

解析的[路径值](general#pathvalue)

## resolveWithKeyValue

键值消息解析器

**签名：**
```typescript
export declare function resolveWithKeyValue(obj: unknown, path: Path): PathValue;
```

**详情**

解析具有键值结构的消息。请注意，无法解析具有层次结构（如对象）的消息

### 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| obj | unknown | 要通过路径解析的目标对象 |
| path | Path | 用于解析消息值的[路径](general#path) |

### 返回值

解析的[路径值](general#pathvalue)

## TranslateOptions

翻译选项

**签名：**
```typescript
export interface TranslateOptions<Locales = Locale> extends LocaleOptions<Locales>
```

**详情**

翻译 API 的选项

### default

**签名：**
```typescript
default?: string | boolean;
```

**详情**

当发生翻译缺失时的默认消息

### escapeParameter

**签名：**
```typescript
escapeParameter?: boolean;
```

**详情**

是否转义列表或命名插值值的参数

### fallbackWarn

**签名：**
```typescript
fallbackWarn?: boolean;
```

**详情**

当您的语言缺少键的翻译时，是否在翻译键上进行模板插值

### list

**签名：**
```typescript
list?: unknown[];
```

**详情**

列表插值

### missingWarn

**签名：**
```typescript
missingWarn?: boolean;
```

**详情**

是否禁止在本地化失败时输出警告

### named

**签名：**
```typescript
named?: NamedValue;
```

**详情**

命名插值

### plural

**签名：**
```typescript
plural?: number;
```

**详情**

复数选择数字

### resolvedMessage

**签名：**
```typescript
resolvedMessage?: boolean;
```

**详情**

消息是否已解析
