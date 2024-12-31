# Legacy API

## Choice

**Signature:**
```typescript
export type Choice = number;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## DateTimeFormatResult

**Signature:**
```typescript
export type DateTimeFormatResult = string;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## LocaleMessageObject

**Signature:**
```typescript
export type LocaleMessageObject<Message = string> = LocaleMessageDictionary<Message>;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## NumberFormatResult

**Signature:**
```typescript
export type NumberFormatResult = string;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## PluralizationRulesMap

**Signature:**
```typescript
export type PluralizationRulesMap = {
    [locale: string]: PluralizationRule;
};
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## TranslateResult

**Signature:**
```typescript
export type TranslateResult = string;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

## VueI18n

VueI18n legacy interfaces

**Signature:**
```typescript
export interface VueI18n<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends string ? [ResourceLocales] extends [never] ? Locale : ResourceLocales : OptionLocale | ResourceLocales, Composition extends Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale> = Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>> 
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This interface is compatible with interface of `VueI18n` class (offered with Vue I18n v8.x).

### availableLocales

**Signature:**
```typescript
readonly availableLocales: Composition['availableLocales'];
```

**Details**

The list of available locales in `messages` in lexical order.

### d

Datetime formatting

**Signature:**
```typescript
d: VueI18nDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**Details**

About details functions, See the [VueI18nDateTimeFormatting](legacy#vuei18ndatetimeformatting)

### datetimeFormats

**Signature:**
```typescript
readonly datetimeFormats: {
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    };
```

**Details**

The datetime formats of localization.

**See Also**
- [Datetime Formatting](../guide/essentials/datetime)

### escapeParameterHtml

**Signature:**
```typescript
escapeParameterHtml: Composition['escapeParameter'];
```

**Details**

Whether interpolation parameters are escaped before the message is translated.

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale: FallbackLocales<Locales>;
```

**Details**

The current fallback locales this VueI18n instance is using.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### formatFallbackMessages

**Signature:**
```typescript
formatFallbackMessages: Composition['fallbackFormat'];
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### getDateTimeFormat

Get datetime format

**Signature:**
```typescript
getDateTimeFormat: Composition['getDateTimeFormat'];
```

**Details**

get datetime format from VueI18n instance [datetimeFormats](legacy#datetimeformats).

### getLocaleMessage

Get locale message

**Signature:**
```typescript
getLocaleMessage: Composition['getLocaleMessage'];
```

**Details**

get locale message from VueI18n instance [messages](legacy#messages).

### getNumberFormat

Get number format

**Signature:**
```typescript
getNumberFormat: Composition['getNumberFormat'];
```

**Details**

get number format from VueI18n instance [numberFormats](legacy#numberFormats).

### id

**Signature:**
```typescript
id: number;
```

**Details**

Instance ID.

### locale

**Signature:**
```typescript
locale: Locales;
```

**Details**

The current locale this VueI18n instance is using.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

### mergeDateTimeFormat

Merge datetime format

**Signature:**
```typescript
mergeDateTimeFormat: Composition['mergeDateTimeFormat'];
```

**Details**

Merge datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).

### mergeLocaleMessage

Merge locale message

**Signature:**
```typescript
mergeLocaleMessage: Composition['mergeLocaleMessage'];
```

**Details**

Merge locale message to VueI18n instance [messages](legacy#messages).

### mergeNumberFormat

Merge number format

**Signature:**
```typescript
mergeNumberFormat: Composition['mergeNumberFormat'];
```

**Details**

Merge number format to VueI18n instance [numberFormats](legacy#numberFormats).

### messages

**Signature:**
```typescript
readonly messages: {
        [K in keyof Messages]: Messages[K];
    };
```

**Details**

The locale messages of localization.

**See Also**
- [Getting Started](../guide/essentials/started)

### missing

**Signature:**
```typescript
missing: MissingHandler | null;
```

**Details**

A handler for localization missing.

### modifiers

**Signature:**
```typescript
readonly modifiers: Composition['modifiers'];
```

**Details**

Custom Modifiers for linked messages.

**See Also**
- [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### n

Number Formatting

**Signature:**
```typescript
n: VueI18nNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**Details**

About details functions, See the [VueI18nNumberFormatting](legacy#vuei18nnumberformatting)

### numberFormats

**Signature:**
```typescript
readonly numberFormats: {
        [K in keyof NumberFormats]: NumberFormats[K];
    };
```

**Details**

The number formats of localization.

**See Also**
- [Number Formatting](../guide/essentials/number)

### pluralizationRules

A set of rules for word pluralization

**Signature:**
```typescript
pluralizationRules: Composition['pluralRules'];
```

**See Also**
- [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**Signature:**
```typescript
postTranslation: PostTranslationHandler<VueMessageType> | null;
```

**Details**

A handler for post processing of translation.

### rt

Resolve locale message translation

**Signature:**
```typescript
rt: VueI18nResolveLocaleMessageTranslation<Locales>;
```

**Details**

About details functions, See the [VueI18nResolveLocaleMessageTranslation](legacy#vuei18nresolvelocalemessagetranslation)

### setDateTimeFormat

Set datetime format

**Signature:**
```typescript
setDateTimeFormat: Composition['setDateTimeFormat'];
```

**Details**

Set datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).

### setLocaleMessage

Set locale message

**Signature:**
```typescript
setLocaleMessage: Composition['setLocaleMessage'];
```

**Details**

Set locale message to VueI18n instance [messages](legacy#messages).

### setNumberFormat

Set number format

**Signature:**
```typescript
setNumberFormat: Composition['setNumberFormat'];
```

**Details**

Set number format to VueI18n instance [numberFormats](legacy#numberFormats).

### silentFallbackWarn

**Signature:**
```typescript
silentFallbackWarn: Composition['fallbackWarn'];
```

**Details**

Whether suppress fallback warnings when localization fails.

### silentTranslationWarn

**Signature:**
```typescript
silentTranslationWarn: Composition['missingWarn'];
```

**Details**

Whether suppress warnings outputted when localization fails.

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### sync

**Signature:**
```typescript
sync: Composition['inheritLocale'];
```

**Details**

Whether synchronize the root level locale to the component localization locale.

**See Also**
- [Local Scope](../guide/essentials/scope#local-scope-2)

### t

Locale message translation

**Signature:**
```typescript
t: VueI18nTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**Details**

About details functions, See the [VueI18nTranslation](legacy#vuei18ntranslation)

### tm

Locale messages getter

**Signature:**
```typescript
tm: Composition['tm'];
```

**Details**

If [i18n component options](injection#i18n) is specified, it’s get in preferentially local scope locale messages than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s get with global scope locale messages.

Based on the current `locale`, locale messages will be returned from Composer instance messages.

If you change the `locale`, the locale messages returned will also correspond to the locale.

If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../guide/essentials/fallback).

:::warning
You need to use `rt` for the locale message returned by `tm`. see the [rt](legacy#rt-message) details.
:::

**Examples**

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

**Signature:**
```typescript
warnHtmlInMessage: WarnHtmlInMessageLevel;
```

**Details**

Whether to allow the use locale messages of HTML formatting.

If you set `warn` or` error`, will check the locale messages on the VueI18n instance.

If you are specified `warn`, a warning will be output at console.

If you are specified `error` will occurred an Error.

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)
- [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### te(key, locale)

Translation locale message exist

**Signature:**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**Details**

whether do exist locale message on VueI18n instance [messages](legacy#messages).

If you specified `locale`, check the locale messages of `locale`.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Str &#124; Key | A target locale message key |
| locale | Locales | A target locale |

#### Returns

 If found locale message, `true`, else `false`

## VueI18nDateTimeFormatting

Datetime formatting functions for VueI18n legacy interfaces

**Signature:**
```typescript
export interface VueI18nDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This is the interface for [VueI18n](legacy#vuei18n)

### (value: number | Date): DateTimeFormatResult;

Datetime formatting

**Signature:**
```typescript
(value: number | Date): DateTimeFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope datetime formats than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope datetime formats.

**See Also**
- [Datetime formatting](../guide/essentials/datetime)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |

#### Returns

 Formatted value

### (value: Value, key: Key | ResourceKeys): DateTimeFormatResult;

Datetime formatting

**Signature:**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | Value | A value, timestamp number or `Date` instance |
| key | Key &#124; ResourceKeys | A key of datetime formats |

#### Returns

 Formatted value

### (value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;

Datetime formatting

**Signature:**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | Value | A value, timestamp number or `Date` instance |
| key | Key &#124; ResourceKeys | A key of datetime formats |
| locale | Locales | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### (value: number | Date, args: {        [key: string]: string | boolean | number;    }): DateTimeFormatResult;

Datetime formatting

**Signature:**
```typescript
(value: number | Date, args: {
        [key: string]: string | boolean | number;
    }): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | An argument values |

#### Returns

 Formatted value

## VueI18nNumberFormatting

Number formatting functions for VueI18n legacy interfaces

**Signature:**
```typescript
export interface VueI18nNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This is the interface for [VueI18n](legacy#vuei18n)

### (value: number): NumberFormatResult;

Number formatting

**Signature:**
```typescript
(value: number): NumberFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope number formats than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope number formats.

**See Also**
- [Number formatting](../guide/essentials/number)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

 Formatted value

### (value: number, key: Key | ResourceKeys): NumberFormatResult;

Number formatting

**Signature:**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | Key &#124; ResourceKeys | A key of number formats |

#### Returns

 Formatted value

### (value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;

Number formatting

**Signature:**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | Key &#124; ResourceKeys | A key of number formats |
| locale | Locales | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### (value: number, args: {        [key: string]: string | boolean | number;    }): NumberFormatResult;

Number formatting

**Signature:**
```typescript
(value: number, args: {
        [key: string]: string | boolean | number;
    }): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | An argument values |

#### Returns

 Formatted value

## VueI18nOptions

VueI18n Options

**Signature:**
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

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This option is compatible with `VueI18n` class constructor options (offered with Vue I18n v8.x)

### availableLocales

**Signature:**
```typescript
availableLocales?: Locale[];
```

**Details**

The list of available locales in messages in lexical order.

**Default Value**

`[]`

### datetime

### datetimeFormats

### escapeParameterHtml

**Signature:**
```typescript
escapeParameterHtml?: Options['escapeParameter'];
```

**Details**

If `escapeParameterHtml` is configured as true then interpolation parameters are escaped before the message is translated.

This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g.  around a user provided value).

This usage pattern mostly occurs when passing precomputed text strings into UI components.

The escape process involves replacing the following symbols with their respective HTML character entities: `<`, `>`, `"`, `'`.

Setting `escapeParameterHtml` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.

**Default Value**

`false`

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale?: Options['fallbackLocale'];
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
fallbackRoot?: Options['fallbackRoot'];
```

**Details**

In the component localization, whether to fall back to root level (global scope) localization when localization fails.

If `false`, it's not fallback to root.

**Default Value**

`true`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### flatJson

**Signature:**
```typescript
flatJson?: Options['flatJson'];
```

**Details**

Allow use flat json messages or not

**Default Value**

`false`

### formatFallbackMessages

**Signature:**
```typescript
formatFallbackMessages?: Options['fallbackFormat'];
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**Default Value**

`false`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### locale

**Signature:**
```typescript
locale?: Options['locale'];
```

**Details**

The locale of localization.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**Default Value**

`'en-US'`

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

### message

### messageResolver

**Signature:**
```typescript
messageResolver?: MessageResolver;
```

**Details**

A message resolver to resolve [`messages`](legacy#messages).

If not specified, the vue-i18n internal message resolver will be used by default.

You need to implement a message resolver yourself that supports the following requirements:

- Resolve the message using the locale message of [`locale`](legacy#locale) passed as the first argument of the message resolver, and the path passed as the second argument.

- If the message could not be resolved, you need to return `null`.

- If you will be returned `null`, the message resolver will also be called on fallback if [`fallbackLocale`](legacy#fallbacklocale-2) is enabled, so the message will need to be resolved as well.

The message resolver is called indirectly by the following APIs:

- [`t`](legacy#t-key)

- [`te`](legacy#te-key-locale)

- [`tm`](legacy#tm-key)

- [Translation component](component#translation)

:::tip
:new: v9.2+
:::

:::warning
If you use the message resolver, the [`flatJson`](legacy#flatjson) setting will be ignored. That is, you need to resolve the flat JSON by yourself.
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
missing?: Options['missing'];
```

**Details**

A handler for localization missing.

The handler gets called with the localization target locale, localization path key, the Vue instance and values.

If missing handler is assigned, and occurred localization missing, it's not warned.

**Default Value**

`null`

### modifiers

**Signature:**
```typescript
modifiers?: Options['modifiers'];
```

**Details**

Custom Modifiers for linked messages.

**See Also**
- [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralizationRules

**Signature:**
```typescript
pluralizationRules?: Options['pluralRules'];
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
postTranslation?: Options['postTranslation'];
```

**Details**

A handler for post processing of translation. The handler gets after being called with the `$t`, and `t`.

This handler is useful if you want to filter on translated text such as space trimming.

**Default Value**

`null`

### sharedMessages

**Signature:**
```typescript
sharedMessages?: LocaleMessages<VueMessageType>;
```

**Details**

The shared locale messages of localization for components. More detail see Component based localization.

**Default Value**

`undefined`

**See Also**
- [Shared locale messages for components](../guide/essentials/local#shared-locale-messages-for-components)

### silentFallbackWarn

**Signature:**
```typescript
silentFallbackWarn?: Options['fallbackWarn'];
```

**Details**

Whether do template interpolation on translation keys when your language lacks a translation for a key.

If `true`, skip writing templates for your "base" language; the keys are your templates.

**Default Value**

`false`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### silentTranslationWarn

**Signature:**
```typescript
silentTranslationWarn?: Options['missingWarn'];
```

**Details**

Whether suppress warnings outputted when localization fails.

If `true`, suppress localization fail warnings.

If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).

**Default Value**

`false`

**See Also**
- [Fallbacking](../guide/essentials/fallback)

### sync

**Signature:**
```typescript
sync?: boolean;
```

**Details**

Whether synchronize the root level locale to the component localization locale.

If `false`, regardless of the root level locale, localize for each component locale.

**Default Value**

`true`

**See Also**
- [Local Scope](../guide/essentials/scope#local-scope-2)

### warnHtmlInMessage

**Signature:**
```typescript
warnHtmlInMessage?: WarnHtmlInMessageLevel;
```

**Details**

Whether to allow the use locale messages of HTML formatting.

See the warnHtmlInMessage property.

**Default Value**

`'off'`

**See Also**
- [HTML Message](../guide/essentials/syntax#html-message)
- [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

## VueI18nResolveLocaleMessageTranslation

Resolve locale message translation functions for VueI18n legacy interfaces

**Signature:**
```typescript
export type VueI18nResolveLocaleMessageTranslation<Locales = 'en-US'> = ComposerResolveLocaleMessageTranslation<Locales>;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This is the interface for [VueI18n](legacy#vuei18n). This interface is an alias of [ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation).

## VueI18nTranslation

Locale message translation functions for VueI18n legacy interfaces

**Signature:**
```typescript
export interface VueI18nTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? PickupPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? PickupKeys<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never> 
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

This is the interface for [VueI18n](legacy#vuei18n)

### (key: Key | ResourceKeys): TranslateResult;

Locale message translation.

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys): TranslateResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s translated in preferentially local scope locale messages than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s translated with global scope locale messages.

**See Also**
- [Scope and Locale Changing](../guide/essentials/scope)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |

#### Returns

 Translated message

### (key: Key | ResourceKeys, named: Record&lt;string, unknown&gt;): TranslateResult;

Locale message translation.

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

 Translated message

### (key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.

**See Also**
- [Pluralization](../guide/essentials/pluralization)
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| named | NamedValue | A values of named interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| named | NamedValue | A values of named interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

Locale message translation for named interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions<Locales>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| named | NamedValue | A values of named interpolation |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys, plural: number): TranslateResult;

Locale message translation for plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, return a pluralized translation message.

You can also suppress the warning, when the translation missing according to the options.

**See Also**
- [Pluralization](../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys, plural: number, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

Locale message translation for plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, return a pluralized translation message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [Pluralization](../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| plural | number | Which plural string to get. 1 returns the first one. |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys, defaultMsg: string): TranslateResult;

Locale message translation for missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, if no translation was found, return a default message.

You can also suppress the warning, when the translation missing according to the options.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

Locale message translation for missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions<Locales>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, if no translation was found, return a default message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

### (key: Key | ResourceKeys, list: unknown[]): TranslateResult;

Locale message translation.

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

 Translated message

### (key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;

Locale message translation for list interpolations and plurals

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.

**See Also**
- [Pluralization](../guide/essentials/pluralization)
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| list | unknown[] | A values of list interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### (key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;

Locale message translation for list interpolations and missing default message

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| list | unknown[] | A values of list interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### (key: Key | ResourceKeys, list: unknown[], options: TranslateOptions&lt;Locales&gt;): TranslateResult;

Locale message translation for list interpolations

**Signature:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], options: TranslateOptions<Locales>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
- [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | A target locale message key |
| list | unknown[] | A values of list interpolation |
| options | TranslateOptions&lt;Locales&gt; | Additional  for translation |

#### Returns

 Translated message

## WarnHtmlInMessageLevel

**Signature:**
```typescript
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error';
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

