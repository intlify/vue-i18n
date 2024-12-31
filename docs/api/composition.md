# Composition API

## Composer

Composer interfaces

**Signature:**
```typescript
export interface Composer<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends Locale ? IsNever<ResourceLocales> extends true ? Locale : ResourceLocales : OptionLocale | ResourceLocales> extends ComposerCustom 
```

**Details**

This is the interface for being used for Vue 3 Composition API.

### availableLocales

**Signature:**
```typescript
readonly availableLocales: Locales[];
```

**Details**

The list of available locales in `messages` in lexical order.

### d

Datetime formatting

**Signature:**
```typescript
d: ComposerDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**Details**

About details functions, See the [ComposerDateTimeFormatting](composition#composerdatetimeformatting)

### datetimeFormats

**Signature:**
```typescript
readonly datetimeFormats: ComputedRef<{
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    }>;
```

**Details**

The datetime formats of localization.

**See Also**
- [Datetime Formatting](../guide/essentials/datetime)

### escapeParameter

**Signature:**
```typescript
escapeParameter: boolean;
```

**Details**

Whether interpolation parameters are escaped before the message is translated.

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)

### fallbackFormat

**Signature:**
```typescript
fallbackFormat: boolean;
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale: WritableComputedRef<FallbackLocales<Locales>>;
```

**Details**

The current fallback locales this Composer instance is using.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackRoot

**Signature:**
```typescript
fallbackRoot: boolean;
```

**Details**

Whether to fall back to root level (global scope) localization when localization fails.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackWarn

**Signature:**
```typescript
fallbackWarn: boolean | RegExp;
```

**Details**

Whether suppress fall back warnings when localization fails.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### id

**Signature:**
```typescript
id: number;
```

**Details**

Instance ID.

### inheritLocale

**Signature:**
```typescript
inheritLocale: boolean;
```

**Details**

Whether inherit the root level locale to the component localization locale.

**See Also**
- [Local Scope](../guide/essentials/scope#local-scope-2)

### isGlobal

**Signature:**
```typescript
readonly isGlobal: boolean;
```

**Details**

Whether this composer instance is global or not

### locale

**Signature:**
```typescript
locale: WritableComputedRef<Locales>;
```

**Details**

The current locale this Composer instance is using.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

### messages

**Signature:**
```typescript
readonly messages: ComputedRef<{
        [K in keyof Messages]: Messages[K];
    }>;
```

**Details**

The locale messages of localization.

**See Also**
- [Getting Started](../guide/essentials/started)

### missingWarn

**Signature:**
```typescript
missingWarn: boolean | RegExp;
```

**Details**

Whether suppress warnings outputted when localization fails.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### modifiers

**Signature:**
```typescript
readonly modifiers: LinkedModifiers<VueMessageType>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
- [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### n

Number Formatting

**Signature:**
```typescript
n: ComposerNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**Details**

About details functions, See the [ComposerNumberFormatting](composition#composernumberformatting)

### numberFormats

**Signature:**
```typescript
readonly numberFormats: ComputedRef<{
        [K in keyof NumberFormats]: NumberFormats[K];
    }>;
```

**Details**

The number formats of localization.

**See Also**
- [Number Formatting](../guide/essentials/number)

### pluralRules

**Signature:**
```typescript
readonly pluralRules: PluralizationRules;
```

**Details**

A set of rules for word pluralization

**See Also**
- [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)

### rt

Resolve locale message translation

**Signature:**
```typescript
rt: ComposerResolveLocaleMessageTranslation<Locales>;
```

**Details**

About details functions, See the [ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation)

### t

Locale message translation

**Signature:**
```typescript
t: ComposerTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**Details**

About details functions, See the [ComposerTranslation](composition#composertranslation)

### warnHtmlMessage

**Signature:**
```typescript
warnHtmlMessage: boolean;
```

**Details**

Whether to allow the use locale messages of HTML formatting.

If you set `false`, will check the locale messages on the Composer instance.

If you are specified `true`, a warning will be output at console.

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)
- [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### getDateTimeFormat(locale)

Get datetime format

**Signature:**
```typescript
getDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Return = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema>(locale: LocaleSchema | Locale): Return;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| DateTimeSchema | The datetime format schema, default `never` |

**Details**

get datetime format from Composer instance [datetimeFormats](composition#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |

#### Returns

 Datetime format

### getLocaleMessage(locale)

Get locale message

**Signature:**
```typescript
getLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Return = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema>(locale: LocaleSchema | Locale): Return;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| MessageSchema | The locale message schema, default `never` |

**Details**

get locale message from Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |

#### Returns

 Locale messages

### getMissingHandler()

Get missing handler

**Signature:**
```typescript
getMissingHandler(): MissingHandler | null;
```

**See Also**
- [missing](composition#missing)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |

#### Returns

 [MissingHandler](composition#missinghandler)

### getNumberFormat(locale)

Get number format

**Signature:**
```typescript
getNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Return = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema>(locale: LocaleSchema | Locale): Return;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| NumberSchema | The number format schema, default `never` |

**Details**

get number format from Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |

#### Returns

 Number format

### getPostTranslationHandler()

Get post translation handler

**Signature:**
```typescript
getPostTranslationHandler(): PostTranslationHandler<VueMessageType> | null;
```

**See Also**
- [missing](composition#posttranslation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |

#### Returns

 

### mergeDateTimeFormat(locale, format)

Merge datetime format

**Signature:**
```typescript
mergeDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Formats = IsNever<DateTimeSchema> extends true ? Record<string, any> : DateTimeSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| DateTimeSchema | The datetime format schema, default `never` |

**Details**

Merge datetime format to Composer instance [datetimeFormats](composition#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| format | Formats | A target datetime format |

### mergeLocaleMessage(locale, message)

Merge locale message

**Signature:**
```typescript
mergeLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Message = IsNever<MessageSchema> extends true ? Record<string, any> : MessageSchema>(locale: LocaleSchema | Locale, message: Message): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| MessageSchema | The locale message schema, default `never` |

**Details**

Merge locale message to Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| message | Message | A message |

### mergeNumberFormat(locale, format)

Merge number format

**Signature:**
```typescript
mergeNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Formats = IsNever<NumberSchema> extends true ? Record<string, any> : NumberSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| NumberSchema | The number format schema, default `never` |

**Details**

Merge number format to Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| format | Formats | A target number format |

### setDateTimeFormat(locale, format)

Set datetime format

**Signature:**
```typescript
setDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, FormatsType = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| DateTimeSchema | The datetime format schema, default `never` |

**Details**

Set datetime format to Composer instance [datetimeFormats](composition#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| format | Formats | A target datetime format |

### setLocaleMessage(locale, message)

Set locale message

**Signature:**
```typescript
setLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, MessageType = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema, Message extends MessageType = MessageType>(locale: LocaleSchema | Locale, message: Message): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| MessageSchema | The locale message schema, default `never` |

**Details**

Set locale message to Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| message | Message | A message |

### setMissingHandler(handler)

Set missing handler

**Signature:**
```typescript
setMissingHandler(handler: MissingHandler | null): void;
```

**See Also**
- [missing](composition#missing)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| handler | MissingHandler &#124; null | A [MissingHandler](composition#missinghandler) |

### setNumberFormat(locale, format)

Set number format

**Signature:**
```typescript
setNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, FormatsType = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### Type Parameters

| Parameter | Description |
| --- | --- |
| NumberSchema | The number format schema, default `never` |

**Details**

Set number format to Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | A target locale |
| format | Formats | A target number format |

### setPostTranslationHandler(handler)

Set post translation handler

**Signature:**
```typescript
setPostTranslationHandler(handler: PostTranslationHandler<VueMessageType> | null): void;
```

**See Also**
- [missing](composition#posttranslation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| handler | PostTranslationHandler&lt;VueMessageType&gt; &#124; null | A  |

### te(key, locale)

Translation locale message exist

**Signature:**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**Details**

whether do exist locale message on Composer instance [messages](composition#messages).

If you specified `locale`, check the locale messages of `locale`.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Str &#124; Key | A target locale message key |
| locale | Locales | A locale, it will be used over than global scope or local scope |

#### Returns

 If found locale message, `true`, else `false`, Note that `false` is returned even if the value present in the key is not translatable, yet if `translateExistCompatible` is set to `true`, it will return `true` if the key is available, even if the value is not translatable.

### tm(key)

Locale messages getter

**Signature:**
```typescript
tm<Key extends string, ResourceKeys extends PickupKeys<Messages> = PickupKeys<Messages>, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Target = IsEmptyObject<Messages> extends false ? NonNullable<Messages>[Locale] : RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>, Return = ResourceKeys extends ResourcePath<Target> ? ResourceValue<Target, ResourceKeys> : Record<string, any>>(key: Key | ResourceKeys): Return;
```

**Details**

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

Based on the current `locale`, locale messages will be returned from Composer instance messages.

If you change the `locale`, the locale messages returned will also correspond to the locale.

If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../guide/essentials/fallback).

:::warning
You need to use `rt` for the locale message returned by `tm`. see the [rt](composition#rt-message) details.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key

 Locale messages |

**Examples**

template block:
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

script block:
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

Composer additional options for `useI18n`

**Signature:**
```typescript
export interface ComposerAdditionalOptions 
```

**Details**

`ComposerAdditionalOptions` is extend for [ComposerOptions](composition#composeroptions), so you can specify these options.

**See Also**
- [useI18n](composition#usei18n)

### useScope

## ComposerCustom

The type custom definition of Composer

**Signature:**
```typescript
export interface ComposerCustom 
```

**Details**

The interface that can extend Composer.

The type defined by 3rd party (e.g. nuxt/i18n)

**Examples**


```ts
// vue-i18n.d.ts (`.d.ts` file at your app)

declare module 'vue-i18n' {
  interface ComposerCustom {
    localeCodes: string[]
  }
}
```




## ComposerDateTimeFormatting

Datetime formatting functions

**Signature:**
```typescript
export interface ComposerDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

**Details**

This is the interface for [Composer](composition#composer)

### (value: number | Date | string): string;

Datetime formatting

**Signature:**
```typescript
(value: number | Date | string): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.

If not, then it’s formatted with global scope datetime formats.

**See Also**
- [Datetime formatting](../guide/essentials/datetime)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date &#124; string | A value, timestamp number or `Date` instance or ISO 8601 string |

#### Returns

 Formatted value

### (value: Value, keyOrOptions: Key | ResourceKeys | DateTimeOptions&lt;Key | ResourceKeys, Locales&gt;): string;

Datetime formatting

**Signature:**
```typescript
<Value extends number | Date | string = number, Key extends string = string>(value: Value, keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>): string;
```

**Details**

Overloaded `d`. About details, see the [call signature](composition#value-number-date-string-string) details.

In this overloaded `d`, format in datetime format for a key registered in datetime formats.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | Value | A value, timestamp number or `Date` instance or ISO 8601 string |
| keyOrOptions | Key &#124; ResourceKeys &#124; DateTimeOptions&lt;Key &#124; ResourceKeys, Locales&gt; | A key of datetime formats, or additional  for datetime formatting |

#### Returns

 Formatted value

### (value: Value, keyOrOptions: Key | ResourceKeys | DateTimeOptions&lt;Key | ResourceKeys, Locales&gt;, locale: Locales): string;

Datetime formatting

**Signature:**
```typescript
<Value extends number | Date | string = number, Key extends string = string>(value: Value, keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>, locale: Locales): string;
```

**Details**

Overloaded `d`. About details, see the [call signature](composition#value-number-date-string-string) details.

In this overloaded `d`, format in datetime format for a key registered in datetime formats at target locale

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | Value | A value, timestamp number or `Date` instance or ISO 8601 string |
| keyOrOptions | Key &#124; ResourceKeys &#124; DateTimeOptions&lt;Key &#124; ResourceKeys, Locales&gt; | A key of datetime formats, or additional  for datetime formatting |
| locale | Locales | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

## ComposerNumberFormatting

Number formatting functions

**Signature:**
```typescript
export interface ComposerNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

**Details**

This is the interface for [Composer](composition#composer)

### (value: number): string;

Number Formatting

**Signature:**
```typescript
(value: number): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.

If not, then it’s formatted with global scope number formats.

**See Also**
- [Number formatting](../guide/essentials/number)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

 Formatted value

### (value: number, keyOrOptions: Key | ResourceKeys | NumberOptions&lt;Key | ResourceKeys, Locales&gt;): string;

Number Formatting

**Signature:**
```typescript
<Key extends string = string>(value: number, keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>): string;
```

**Details**

Overloaded `n`. About details, see the [call signature](composition#value-number-string) details.

In this overloaded `n`, format in number format for a key registered in number formats.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| keyOrOptions | Key &#124; ResourceKeys &#124; NumberOptions&lt;Key &#124; ResourceKeys, Locales&gt; | A key of number formats, or additional  for number formatting |

#### Returns

 Formatted value

### (value: number, keyOrOptions: Key | ResourceKeys | NumberOptions&lt;Key | ResourceKeys, Locales&gt;, locale: Locales): string;

Number Formatting

**Signature:**
```typescript
<Key extends string = string>(value: number, keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>, locale: Locales): string;
```

**Details**

Overloaded `n`. About details, see the [call signature](composition#value-number-string) details.

In this overloaded `n`, format in number format for a key registered in number formats at target locale.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| keyOrOptions | Key &#124; ResourceKeys &#124; NumberOptions&lt;Key &#124; ResourceKeys, Locales&gt; | A key of number formats, or additional  for number formatting |
| locale | Locales | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

## ComposerOptions

Composer Options

**Signature:**
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

**Details**

This is options to create composer.

### datetime

### datetimeFormats

### escapeParameter

**Signature:**
```typescript
escapeParameter?: boolean;
```

**Details**

If `escapeParameter` is configured as true then interpolation parameters are escaped before the message is translated.

This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g.  around a user provided value).

This usage pattern mostly occurs when passing precomputed text strings into UI components.

The escape process involves replacing the following symbols with their respective HTML character entities: `<`, `>`, `"`, `'`.

Setting `escapeParameter` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.

**Default Value**

`false`

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)

### fallbackFormat

**Signature:**
```typescript
fallbackFormat?: boolean;
```

**Details**

Whether do template interpolation on translation keys when your language lacks a translation for a key.

If `true`, skip writing templates for your "base" language; the keys are your templates.

**Default Value**

`false`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale?: FallbackLocale;
```

**Details**

The locale of fallback localization.

For more complex fallback definitions see fallback.

**Default Value**

The default `'en-US'` for the `locale` if it's not specified, or it's `locale` value

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackRoot

**Signature:**
```typescript
fallbackRoot?: boolean;
```

**Details**

In the component localization, whether to fallback to root level (global scope) localization when localization fails.

If `false`, it's not fallback to root.

**Default Value**

`true`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### fallbackWarn

**Signature:**
```typescript
fallbackWarn?: boolean | RegExp;
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

If `false`, suppress fall back warnings.

If you use regular expression, you can suppress fallback warnings that it match with translation key (e.g. `t`).

**Default Value**

`true`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### flatJson

**Signature:**
```typescript
flatJson?: boolean;
```

**Details**

Allow use flat json messages or not

**Default Value**

`false`

### inheritLocale

**Signature:**
```typescript
inheritLocale?: boolean;
```

**Details**

Whether inheritance the root level locale to the component localization locale.

If `false`, regardless of the root level locale, localize for each component locale.

**Default Value**

`true`

**See Also**
- [Local Scope](../guide/essentials/scope#local-scope-2)

### locale

**Signature:**
```typescript
locale?: Locale;
```

**Details**

The locale of localization.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**Default Value**

`'en-US'`

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

### message

### messageCompiler

**Signature:**
```typescript
messageCompiler?: MessageCompiler;
```

**Details**

A compiler for custom message format.

If not specified, the vue-i18n default message compiler will be used.

You will need to implement your own message compiler that returns Message Functions

:::tip
:new: v9.3+
:::

:::warning
The Custom Message Format is an experimental feature. It may receive breaking changes or be removed in the future.
:::

**Default Value**

`undefined`

**See Also**
- [Custom Message Format](../guide/advanced/format)

**Examples**

Here is an example of how to custom message compiler with `intl-messageformat`
```js
import { createI18n } from 'vue-i18n'
import IntlMessageFormat from 'intl-messageformat'

function messageCompiler(message, { locale, key, onError }) {
  if (typeof message === 'string') {
    // You can tune your message compiler performance more with your cache strategy or also memoization at here
    const formatter = new IntlMessageFormat(message, locale)
    return ctx => formatter.format(ctx.values)
  } else {
    // If you would like to support it for AST,
    // You need to transform locale mesages such as `json`, `yaml`, etc. with the bundle plugin.
    onError && onError(new Error('not support for AST'))
    return () => key // return default with `key`
  }
}

// call with I18n option
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messageCompiler, // set your message compiler
  messages: {
    en: {
      hello: 'hello world!',
      greeting: 'hi, {name}!',
      // ICU Message format
      photo: `You have {numPhotos, plural,
        =0 {no photos.}
        =1 {one photo.}
        other {# photos.}
      }`
    },
  }
})

// the below your something to do ...
// ...
```




### messageResolver

**Signature:**
```typescript
messageResolver?: MessageResolver;
```

**Details**

A message resolver to resolve [`messages`](composition#messages).

If not specified, the vue-i18n internal message resolver will be used by default.

You need to implement a message resolver yourself that supports the following requirements:

- Resolve the message using the locale message of [`locale`](composition#locale) passed as the first argument of the message resolver, and the path passed as the second argument.

- If the message could not be resolved, you need to return `null`.

- If you will be returned `null`, the message resolver will also be called on fallback if [`fallbackLocale`](composition#fallbacklocale-2) is enabled, so the message will need to be resolved as well.

The message resolver is called indirectly by the following APIs:

- [`t`](composition#t-key)

- [`te`](composition#te-key-locale)

- [`tm`](composition#tm-key)

- [Translation component](component#translation)

:::tip
:new: v9.2+
:::

:::warning
If you use the message resolver, the [`flatJson`](composition#flatjson) setting will be ignored. That is, you need to resolve the flat JSON by yourself.
:::

**Default Value**

`undefined`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

**Examples**

Here is an example of how to set it up using your `createI18n`:
```js
import { createI18n } from 'vue-i18n'

// your message resolver
function messageResolver(obj, path) {
  // simple message resolving!
  const msg = obj[path]
  return msg != null ? msg : null
}

// call with I18n option
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messageResolver, // set your message resolver
  messages: {
    en: { ... },
    ja: { ... }
  }
})

// the below your something to do ...
// ...
```




### messages

### missing

**Signature:**
```typescript
missing?: MissingHandler;
```

**Details**

A handler for localization missing.

The handler gets called with the localization target locale, localization path key, the Vue instance and values.

If missing handler is assigned, and occurred localization missing, it's not warned.

**Default Value**

`null`

### missingWarn

**Signature:**
```typescript
missingWarn?: boolean | RegExp;
```

**Details**

Whether suppress warnings outputted when localization fails.

If `false`, suppress localization fail warnings.

If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).

**Default Value**

`true`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### modifiers

**Signature:**
```typescript
modifiers?: LinkedModifiers<VueMessageType>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
- [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralRules

**Signature:**
```typescript
pluralRules?: PluralizationRules;
```

**Details**

A set of rules for word pluralization

**Default Value**

`{}`

**See Also**
- [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**Signature:**
```typescript
postTranslation?: PostTranslationHandler<VueMessageType>;
```

**Details**

A handler for post processing of translation.

The handler gets after being called with the `t`.

This handler is useful if you want to filter on translated text such as space trimming.

**Default Value**

`null`

### warnHtmlMessage

**Signature:**
```typescript
warnHtmlMessage?: boolean;
```

**Details**

Whether to allow the use locale messages of HTML formatting.

See the warnHtmlMessage property.

**Default Value**

`'off'`

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)
- [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

## ComposerResolveLocaleMessageTranslation

Resolve locale message translation functions

**Signature:**
```typescript
export interface ComposerResolveLocaleMessageTranslation<Locales = 'en-US'> 
```

**Details**

This is the interface for [Composer](composition#composer)

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType): string;

Resolve locale message translation

**Signature:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

If not, then it’s translated with global scope locale messages.

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

:::tip
The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
`rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |

#### Returns

 Translated message

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, plural: number, options?: TranslateOptions&lt;Locales&gt;): string;

Resolve locale message translation for plurals

**Signature:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
- [Pluralization](../guide/essentials/pluralization)

:::tip
The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
`rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
| plural | number | Which plural string to get. 1 returns the first one. |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, list: unknown[], options?: TranslateOptions&lt;Locales&gt;): string;

Resolve locale message translation for list interpolations

**Signature:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

:::tip
The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
`rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
| list | unknown[] | A values of list interpolation. |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, named: NamedValue, options?: TranslateOptions&lt;Locales&gt;): string;

Resolve locale message translation for named interpolations

**Signature:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `rt`. About details, see the [call signature](composition#message-messagefunction-message-message-string) details.

In this overloaded `rt`, for each placeholder x, the locale messages should contain a `{x}` token.

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

:::tip
The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
`rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
| named | NamedValue | A values of named interpolation. |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

## ComposerTranslation

Locale message translation functions

**Signature:**
```typescript
export interface ComposerTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? JsonPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? TranslationsPaths<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

**Details**

This is the interface for [Composer](composition#composer)

### (key: Key | ResourceKeys | number): string;

Locale message translation

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

If not, then it’s translated with global scope locale messages.

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, named: NamedValue): string;

Locale message translation for named interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.

You can also suppress the warning, when the translation missing according to the options.

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.

**See Also**
- [Pluralization](../guide/essentials/pluralization)
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): string;

Locale message translation for named interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, plural: number): string;

Locale message translation for plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, return a pluralized translation message.

You can also suppress the warning, when the translation missing according to the options.

**See Also**
- [Pluralization](../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, plural: number, options: TranslateOptions&lt;Locales&gt;): string;

Locale message translation for plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number, options: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, return a pluralized translation message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [Pluralization](../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| plural | number | Which plural string to get. 1 returns the first one. |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, defaultMsg: string): string;

Locale message translation for missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, if no translation was found, return a default message.

You can also suppress the warning, when the translation missing according to the options.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): string;

Locale message translation for missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, if no translation was found, return a default message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, list: unknown[]): string;

Locale message translation for list interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[]): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.

You can also suppress the warning, when the translation missing according to the options.

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, list: unknown[], plural: number): string;

Locale message translation for list interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], plural: number): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.

**See Also**
- [Pluralization](../guide/essentials/pluralization)
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;

Locale message translation for list interpolations and missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions&lt;Locales&gt;): string;

Locale message translation for list interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions<Locales>): string;
```

**Details**

Overloaded `t`. About details, see the [call signature](composition#key-key-resourcekeys-number-string) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

## MissingHandler

**Signature:**
```typescript
export type MissingHandler = (locale: Locale, key: Path, instance?: ComponentInternalInstance, type?: string) => string | void;
```

## useI18n

Use Composition API for Vue I18n

**Signature:**
```typescript
export declare function useI18n<Schema = DefaultLocaleMessageSchema, Locales = 'en-US', Options extends UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>>(options?: Options): Composer<NonNullable<Options['messages']>, NonNullable<Options['datetimeFormats']>, NonNullable<Options['numberFormats']>, NonNullable<Options['locale']>>;
```

### Type Parameters

| Parameter | Description |
| --- | --- |
| Schema | The i18n resources (messages, datetimeFormats, numberFormats) schema, default  |
| Locales | The locales of i18n resource schema, default `en-US` |

**Details**

This function is mainly used by `setup`.

If options are specified, Composer instance is created for each component and you can be localized on the component.

If options are not specified, you can be localized using the global Composer.

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| options | Options | An options, see [UseI18nOptions](composition#usei18noptions) |

### Returns

 [Composer](composition#composer) instance

**Examples**

case: Component resource base localization
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
   // Something to do ...

   return { ..., t, locale }
 }
}
</script>
```




## UseI18nOptions

I18n Options for `useI18n`

**Signature:**
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

**Details**

`UseI18nOptions` is inherited [ComposerAdditionalOptions](composition#composeradditionaloptions) and [ComposerOptions](composition#composeroptions), so you can specify these options.

**See Also**
- [useI18n](composition#usei18n)

## VueMessageType

**Signature:**
```typescript
export type VueMessageType = string | ResourceNode | VNode;
```

