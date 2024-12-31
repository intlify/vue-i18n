# General

## createI18n

Vue I18n factory

**Signature:**
```typescript
export declare function createI18n<Schema extends object = DefaultLocaleMessageSchema, Locales extends string | object = 'en-US', Legacy extends boolean = true, Options extends I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>, Messages extends Record<string, unknown> = NonNullable<Options['messages']> extends Record<string, unknown> ? NonNullable<Options['messages']> : {}, DateTimeFormats extends Record<string, unknown> = NonNullable<Options['datetimeFormats']> extends Record<string, unknown> ? NonNullable<Options['datetimeFormats']> : {}, NumberFormats extends Record<string, unknown> = NonNullable<Options['numberFormats']> extends Record<string, unknown> ? NonNullable<Options['numberFormats']> : {}, OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale>(options: Options): (typeof options)['legacy'] extends true ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, true> : (typeof options)['legacy'] extends false ? I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, false> : I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale, Legacy>;
```

### Type Parameters

| Parameter | Description |
| --- | --- |
| Schema | The i18n resources (messages, datetimeFormats, numberFormats) schema, default  |
| Locales | The locales of i18n resource schema, default `en-US` |
| Legacy | Whether legacy mode is enabled or disabled, default `true` |

**Details**

If you use Legacy API mode, you need to specify [VueI18nOptions](legacy#vuei18noptions) and `legacy: true` option.

If you use composition API mode, you need to specify [ComposerOptions](composition#composeroptions).

**See Also**
- [Getting Started](../guide/essentials/started)
- [Composition API](../guide/advanced/composition)

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| options | Options | An options, see the [I18nOptions](general#i18noptions) |

### Returns

 [I18n](general#i18n) instance

**Examples**

**Example 1:**

case: for Legacy API
```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

// call with I18n option
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: { ... },
    ja: { ... }
  }
})

const App = {
  // ...
}

const app = createApp(App)

// install!
app.use(i18n)
app.mount('#app')
```



**Example 2:**

case: for composition API
```js
import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

// call with I18n option
const i18n = createI18n({
  legacy: false, // you must specify 'legacy: false' option
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

// install!
app.use(i18n)
app.mount('#app')
```




## DefineDateTimeFormat

The type definition of datetime format

**Signature:**
```typescript
export interface DefineDateTimeFormat extends DateTimeFormat 
```

**Details**

The typealias is used to strictly define the type of the Datetime format.

The type defined by this can be used in the global scope.

**Examples**


```ts
// type.d.ts (`.d.ts` file at your app)
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

The type definition of Locale Message

**Signature:**
```typescript
export interface DefineLocaleMessage extends LocaleMessage<VueMessageType> 
```

**Details**

The typealias is used to strictly define the type of the Locale message.

The type defined by this can be used in the global scope.

**Examples**


```ts
// type.d.ts (`.d.ts` file at your app)
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

The type definition of number format

**Signature:**
```typescript
export interface DefineNumberFormat extends NumberFormat 
```

**Details**

The typealias is used to strictly define the type of the Number format.

The type defined by this can be used in the global scope.

**Examples**


```ts
// type.d.ts (`.d.ts` file at your app)
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

Exported global composer instance

**Signature:**
```typescript
export interface ExportedGlobalComposer 
```

**Details**

This interface is the [global composer](general#global) that is provided interface that is injected into each component with `app.config.globalProperties`.

### availableLocales

Available locales

**Signature:**
```typescript
readonly availableLocales: Locale[];
```

**Details**

This property is proxy-like property for `Composer#availableLocales`. About details, see the [Composer#availableLocales](composition#availablelocales)

### fallbackLocale

Fallback locale

**Signature:**
```typescript
fallbackLocale: FallbackLocale;
```

**Details**

This property is proxy-like property for `Composer#fallbackLocale`. About details, see the [Composer#fallbackLocale](composition#fallbacklocale)

### locale

Locale

**Signature:**
```typescript
locale: Locale;
```

**Details**

This property is proxy-like property for `Composer#locale`. About details, see the [Composer#locale](composition#locale)

## I18n

I18n instance

**Signature:**
```typescript
export interface I18n<Messages extends Record<string, unknown> = {}, DateTimeFormats extends Record<string, unknown> = {}, NumberFormats extends Record<string, unknown> = {}, OptionLocale = Locale, Legacy = boolean> 
```

**Details**

The instance required for installation as the Vue plugin

### global

The property accessible to the global Composer instance or VueI18n instance

**Signature:**
```typescript
readonly global: Legacy extends true ? VueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale> : Legacy extends false ? Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale> : unknown;
```

**Details**

If the [I18n#mode](general#mode) is `'legacy'`, then you can access to a global [VueI18n](legacy#vuei18n) instance, else then [I18n#mode](general#mode) is `'composition' `, you can access to the global [Composer](composition#composer) instance.

An instance of this property is **global scope***.

### mode

Vue I18n API mode

**Signature:**
```typescript
readonly mode: I18nMode;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

If you specified `legacy: true` option in `createI18n`, return `legacy`, else `composition`

**Default Value**

`'legacy'`

### dispose()

Release global scope resource

**Signature:**
```typescript
dispose(): void;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |

### install(app, options)

Install entry point

**Signature:**
```typescript
install(app: App, ...options: unknown[]): void;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| app | App | A target Vue app instance |
| options | unknown[] | An install options |

## I18nAdditionalOptions

I18n Additional Options

**Signature:**
```typescript
export interface I18nAdditionalOptions 
```

**Details**

Specific options for 

### globalInjection

Whether to inject global properties & functions into for each component.

**Signature:**
```typescript
globalInjection?: boolean;
```

**Details**

If set to `true`, then properties and methods prefixed with `$` are injected into Vue Component.

**Default Value**

`true`

**See Also**
- [Implicit with injected properties and functions](../guide/advanced/composition#implicit-with-injected-properties-and-functions)
- [ComponentCustomProperties](injection#componentcustomproperties)

### legacy

Whether vue-i18n Legacy API mode use on your Vue App

**Signature:**
```typescript
legacy?: boolean;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

The default is to use the Legacy API mode. If you want to use the Composition API mode, you need to set it to `false`.

**Default Value**

`true`

**See Also**
- [Composition API](../guide/advanced/composition)

## I18nInjectionKey

Injection key for 

**Signature:**
```typescript
I18nInjectionKey: InjectionKey<I18n> | string
```

**Details**

The global injection key for I18n instances with `useI18n`. this injection key is used in Web Components. Specify the i18n instance created by  together with `provide` function.

## I18nMode

Vue I18n API mode

**Signature:**
```typescript
export type I18nMode = 'legacy' | 'composition';
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**See Also**
- [I18n#mode](general#mode)

## I18nOptions

I18n Options for `createI18n`

**Signature:**
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
} | string = Locale, Options extends ComposerOptions<Schema, Locales> | VueI18nOptions<Schema, Locales> = ComposerOptions<Schema, Locales> | VueI18nOptions<Schema, Locales>> = I18nAdditionalOptions & Options;
```

**Details**

`I18nOptions` is inherited [I18nAdditionalOptions](general#i18nadditionaloptions), [ComposerOptions](composition#composeroptions) and [VueI18nOptions](legacy#vuei18noptions), so you can specify these options.

## I18nPluginOptions

Vue I18n plugin options

**Signature:**
```typescript
export interface I18nPluginOptions 
```

**Details**

An options specified when installing Vue I18n as Vue plugin with using `app.use`.

### globalInstall

Whether to globally install the components that is offered by Vue I18n

**Signature:**
```typescript
globalInstall?: boolean;
```

**Details**

If this option is enabled, the components will be installed globally at `app.use` time.

If you want to install manually in the `import` syntax, you can set it to `false` to install when needed.

**Default Value**

`true`

## I18nScope

I18n Scope

**Signature:**
```typescript
export type I18nScope = 'local' | 'parent' | 'global';
```

**See Also**
- [ComposerAdditionalOptions#useScope](composition#usescope)
- [useI18n](composition#usei18n)

## VERSION

Vue I18n Version

**Signature:**
```typescript
VERSION: string
```

**Details**

Semver format. Same format as the package.json `version` field.

## DateTimeOptions

DateTime options

**Signature:**
```typescript
export interface DateTimeOptions<Key = string, Locales = Locale> extends Intl.DateTimeFormatOptions, LocaleOptions<Locales> 
```

**Details**

Options for Datetime formatting API

### fallbackWarn

**Signature:**
```typescript
fallbackWarn?: boolean;
```

**Details**

Whether do resolve on format keys when your language lacks a formatting for a key

### key

**Signature:**
```typescript
key?: Key;
```

**Details**

The target format key

### missingWarn

**Signature:**
```typescript
missingWarn?: boolean;
```

**Details**

Whether suppress warnings outputted when localization fails

### part

**Signature:**
```typescript
part?: boolean;
```

**Details**

Whether to use [Intel.DateTimeFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)

## DefineCoreLocaleMessage

The type definition of Locale Message for `@intlify/core-base` package

**Signature:**
```typescript
export interface DefineCoreLocaleMessage extends LocaleMessage<string> 
```

**Details**

The typealias is used to strictly define the type of the Locale message.

**Examples**


```ts
// type.d.ts (`.d.ts` file at your app)
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

**Signature:**
```typescript
export type FallbackLocale = Locale | Locale[] | {
    [locale in string]: Locale[];
} | false;
```

## fallbackWithLocaleChain

Fallback with locale chain

**Signature:**
```typescript
export declare function fallbackWithLocaleChain<Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**Details**

A fallback locale function implemented with a fallback chain algorithm. It's used in VueI18n as default.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| ctx | CoreContext&lt;Message&gt; | A [context](#corecontext) |
| fallback | FallbackLocale | A [fallback locale](general#fallbacklocale) |
| start | Locale | A starting [locale](general#locale) |

### Returns

 Fallback locales

## fallbackWithSimple

Fallback with simple implemenation

**Signature:**
```typescript
export declare function fallbackWithSimple<Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**Details**

A fallback locale function implemented with a simple fallback algorithm.

Basically, it returns the value as specified in the `fallbackLocale` props, and is processed with the fallback inside intlify.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| ctx | CoreContext&lt;Message&gt; | A [context](#corecontext) |
| fallback | FallbackLocale | A [fallback locale](general#fallbacklocale) |
| start | Locale | A starting [locale](general#locale) |

### Returns

 Fallback locales

## LinkedModifiers

**Signature:**
```typescript
export type LinkedModifiers<T = string> = {
    [key: string]: LinkedModify<T>;
};
```

## Locale

**Signature:**
```typescript
export type Locale = IsNever<GeneratedLocale> extends true ? string : GeneratedLocale;
```

## LocaleDetector

**Signature:**
```typescript
export interface LocaleDetector<Args extends any[] = any[]> 
```

### resolvedOnce

### (...args: Args): Locale | Promise&lt;Locale&gt;;

## LocaleFallbacker

The locale fallbacker

**Signature:**
```typescript
export type LocaleFallbacker = <Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale) => Locale[];
```

## LocaleMessage

**Signature:**
```typescript
export type LocaleMessage<Message = string> = Record<string, LocaleMessageValue<Message>>;
```

## LocaleMessageDictionary

**Signature:**
```typescript
export type LocaleMessageDictionary<T, Message = string> = {
    [K in keyof T]: LocaleMessageType<T[K], Message>;
};
```

## LocaleMessages

**Signature:**
```typescript
export type LocaleMessages<Schema, Locales = Locale, Message = string> = LocaleRecord<UnionToTuple<Locales>, Schema>;
```

## LocaleMessageType

**Signature:**
```typescript
export type LocaleMessageType<T, Message = string> = T extends string ? string : T extends () => Promise<infer P> ? LocaleMessageDictionary<P, Message> : T extends (...args: infer Arguments) => any ? (...args: Arguments) => ReturnType<T> : T extends Record<string, unknown> ? LocaleMessageDictionary<T, Message> : T extends Array<T> ? {
    [K in keyof T]: T[K];
} : T;
```

## LocaleMessageValue

**Signature:**
```typescript
export type LocaleMessageValue<Message = string> = LocaleMessageDictionary<any, Message> | string;
```

## LocaleOptions

**Signature:**
```typescript
export interface LocaleOptions<Locales = Locale> 
```

### locale

**Signature:**
```typescript
locale?: Locales | LocaleDetector;
```

**Details**

The locale of localization

## MessageCompiler

The message compiler

**Signature:**
```typescript
export type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

## MessageCompilerContext

The context that will pass the message compiler.

**Signature:**
```typescript
export type MessageCompilerContext = Pick<CompileOptions, 'onError' | 'onCacheKey'> & {
    warnHtmlMessage?: boolean;
    key: string;
    locale: Locale;
};
```

## MessageContext

The message context.

**Signature:**
```typescript
export interface MessageContext<T = string> 
```

### type

The message type to be handled by the message function.

**Signature:**
```typescript
type: string;
```

**Details**

Usually `text`, you need to return **string** in message function.

### values

The message values.

**Signature:**
```typescript
values: Record<string, unknown>;
```

**Details**

The message values are the argument values passed from translation function, such as `$t`, `t`, or `translate`.

**Examples**

vue-i18n `$t` (or `t`) case:
```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p> <!-- `{ name: 'DIO' }` is message values -->
```

`@intlify/core` (`@intlify/core-base`) `translate` case:
```js
translate(context, 'foo.bar', ['dio']) // `['dio']` is message values
```




### linked(key, modifier)

Resolve linked message.

**Signature:**
```typescript
linked(key: Path, modifier?: string): MessageType<T>;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A message key |
| modifier | string | A modifier |

#### Returns

 A resolve message.

### linked(key, modifier, type)

Overloaded `linked`

**Signature:**
```typescript
linked(key: Path, modifier?: string, type?: string): MessageType<T>;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A message key |
| modifier | string | A modifier |
| type | string | A message type |

#### Returns

 A resolve message.

### linked(key, optoins)

Overloaded `linked`

**Signature:**
```typescript
linked(key: Path, optoins?: LinkedOptions): MessageType<T>;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A message key |
| optoins | LinkedOptions | An [linked options](#linkedoptions) |

#### Returns

 A resolve message.

### list(index)

Resolve message value from list.

**Signature:**
```typescript
list(index: number): unknown;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| index | number | An index of message values. |

#### Returns

 A resolved message value.

**Examples**


```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```




### named(key)

Resolve message value from named.

**Signature:**
```typescript
named(key: string): unknown;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | string | A key of message value. |

#### Returns

 A resolved message value.

**Examples**


```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```




### plural(messages)

Resolve message with plural index.

**Signature:**
```typescript
plural(messages: T[]): T;
```

**Details**

That's resolved with plural index with translation function.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| messages | T[] | the messages, that is resolved with plural index with translation function. |

#### Returns

 A resolved message.

**Examples**


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

The Message Function.

**Signature:**
```typescript
export type MessageFunction<T = string> = MessageFunctionCallable | MessageFunctionInternal<T>;
```

## MessageFunctionReturn

**Signature:**
```typescript
export type MessageFunctionReturn<T = string> = T extends string ? MessageType<T> : MessageType<T>[];
```

## MessageResolver

**Signature:**
```typescript
export type MessageResolver = (obj: unknown, path: Path) => PathValue;
```

## NamedValue

**Signature:**
```typescript
export type NamedValue<T = {}> = T & Record<string, unknown>;
```

## NumberOptions

Number Options

**Signature:**
```typescript
export interface NumberOptions<Key = string, Locales = Locale> extends Intl.NumberFormatOptions, LocaleOptions<Locales> 
```

**Details**

Options for Number formatting API

### fallbackWarn

**Signature:**
```typescript
fallbackWarn?: boolean;
```

**Details**

Whether do resolve on format keys when your language lacks a formatting for a key

### key

**Signature:**
```typescript
key?: Key;
```

**Details**

The target format key

### missingWarn

**Signature:**
```typescript
missingWarn?: boolean;
```

**Details**

Whether suppress warnings outputted when localization fails

### part

**Signature:**
```typescript
part?: boolean;
```

**Details**

Whether to use [Intel.NumberFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)

## Path

**Signature:**
```typescript
export type Path = string;
```

## PathValue

**Signature:**
```typescript
export type PathValue = string | number | boolean | Function | null | {
    [key: string]: PathValue;
} | PathValue[];
```

## PluralizationRules

**Signature:**
```typescript
export type PluralizationRules = {
    [locale: string]: PluralizationRule;
};
```

## PostTranslationHandler

**Signature:**
```typescript
export type PostTranslationHandler<Message = string> = (translated: MessageFunctionReturn<Message>, key: string) => MessageFunctionReturn<Message>;
```

## registerLocaleFallbacker

Register the locale fallbacker

**Signature:**
```typescript
export declare function registerLocaleFallbacker(fallbacker: LocaleFallbacker): void;
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| fallbacker | LocaleFallbacker | A [LocaleFallbacker](general#localefallbacker) function |

## registerMessageResolver

Register the message resolver

**Signature:**
```typescript
export declare function registerMessageResolver(resolver: MessageResolver): void;
```

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| resolver | MessageResolver | A [MessageResolver](general#messageresolver) function |

## resolveValue

message resolver

**Signature:**
```typescript
export declare function resolveValue(obj: unknown, path: Path): PathValue;
```

**Details**

Resolves messages. messages with a hierarchical structure such as objects can be resolved. This resolver is used in VueI18n as default.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| obj | unknown | A target object to be resolved with path |
| path | Path | A [path](general#path) to resolve the value of message |

### Returns

 A resolved [path value](general#pathvalue)

## resolveWithKeyValue

key-value message resolver

**Signature:**
```typescript
export declare function resolveWithKeyValue(obj: unknown, path: Path): PathValue;
```

**Details**

Resolves messages with the key-value structure. Note that messages with a hierarchical structure such as objects cannot be resolved

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| obj | unknown | A target object to be resolved with path |
| path | Path | A [path](general#path) to resolve the value of message |

### Returns

 A resolved [path value](general#pathvalue)

## TranslateOptions

Translate Options

**Signature:**
```typescript
export interface TranslateOptions<Locales = Locale> extends LocaleOptions<Locales> 
```

**Details**

Options for Translation API

### default

**Signature:**
```typescript
default?: string | boolean;
```

**Details**

Default message when is occurred translation missing

### escapeParameter

**Signature:**
```typescript
escapeParameter?: boolean;
```

**Details**

Whether do escape parameter for list or named interpolation values

### fallbackWarn

**Signature:**
```typescript
fallbackWarn?: boolean;
```

**Details**

Whether do template interpolation on translation keys when your language lacks a translation for a key

### list

**Signature:**
```typescript
list?: unknown[];
```

**Details**

List interpolation

### missingWarn

**Signature:**
```typescript
missingWarn?: boolean;
```

**Details**

Whether suppress warnings outputted when localization fails

### named

**Signature:**
```typescript
named?: NamedValue;
```

**Details**

Named interpolation

### plural

**Signature:**
```typescript
plural?: number;
```

**Details**

Plulralzation choice number

### resolvedMessage

**Signature:**
```typescript
resolvedMessage?: boolean;
```

**Details**

Whether the message has been resolved

