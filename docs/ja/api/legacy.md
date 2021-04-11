# Legacy API

## DateTimeFormatResult

**Signature:**
```typescript
export declare type DateTimeFormatResult = string;
```

## LocaleMessageObject

**Signature:**
```typescript
export declare type LocaleMessageObject<Message = string> = LocaleMessageDictionary<Message>;
```

## NumberFormatResult

**Signature:**
```typescript
export declare type NumberFormatResult = string;
```

## TranslateResult

**Signature:**
```typescript
export declare type TranslateResult = string;
```

## VueI18n

VueI18n legacy interfaces

**Signature:**
```typescript
export interface VueI18n<Messages = {}, DateTimeFormats = {}, NumberFormats = {}> 
```

**Details**

This interface is compatible with interface of `VueI18n` class (offered with Vue I18n v8.x).

### availableLocales

**Signature:**
```typescript
readonly availableLocales: Locale[];
```

**Details**

The list of available locales in `messages` in lexical order.

### datetimeFormats

**Signature:**
```typescript
readonly datetimeFormats: DateTimeFormats;
```

**Details**

The datetime formats of localization.

**See Also**
-  [Datetime Formatting](../guide/essentials/datetime)

### escapeParameterHtml

**Signature:**
```typescript
escapeParameterHtml: boolean;
```

**Details**

Whether interpolation parameters are escaped before the message is translated.

**See Also**
-  [HTML Message](../guide/essentials/syntax#html-message)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale: FallbackLocale;
```

**Details**

The current fallback locales this VueI18n instance is using.

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### formatFallbackMessages

**Signature:**
```typescript
formatFallbackMessages: boolean;
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### formatter

**Signature:**
```typescript
formatter: Formatter;
```

:::danger DEPRECATED
See the [here](../guide/migration/breaking#remove-custom-formatter)
:::

**Details**

The formatter that implemented with Formatter interface.

### getChoiceIndex

Get choice index

**Signature:**
```typescript
getChoiceIndex: (choice: Choice, choicesLength: number) => number;
```

:::danger DEPRECATED
Use `pluralizationRules` option instead of `getChoiceIndex`.
:::

**Details**

Get pluralization index for current pluralizing number and a given amount of choices.

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
locale: Locale;
```

**Details**

The current locale this VueI18n instance is using.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**See Also**
-  [Scope and Locale Changing](../guide/essentials/scope)

### messages

**Signature:**
```typescript
readonly messages: Messages;
```

**Details**

The locale messages of localization.

**See Also**
-  [Getting Started](../guide/)

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
readonly modifiers: LinkedModifiers<VueMessageType>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
-  [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### numberFormats

**Signature:**
```typescript
readonly numberFormats: NumberFormats;
```

**Details**

The number formats of localization.

**See Also**
-  [Number Formatting](../guide/essentials/number)

### pluralizationRules

A set of rules for word pluralization

**Signature:**
```typescript
pluralizationRules: PluralizationRules;
```

**See Also**
-  [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**Signature:**
```typescript
postTranslation: PostTranslationHandler<VueMessageType> | null;
```

**Details**

A handler for post processing of translation.

### preserveDirectiveContent

**Signature:**
```typescript
preserveDirectiveContent: boolean;
```

:::danger DEPRECATED
The `v-t` directive for Vue 3 now preserves the default content. Therefore, this option and its properties have been removed from the VueI18n instance.
:::

**Details**

Whether `v-t` directive's element should preserve `textContent` after directive is unbinded.

**See Also**
-  [Custom Directive](../guide/advanced/directive)  
-  [Remove preserveDirectiveContent option](../guide/migration/breaking#remove-preservedirectivecontent-option)

### silentFallbackWarn

**Signature:**
```typescript
silentFallbackWarn: boolean | RegExp;
```

**Details**

Whether suppress fallback warnings when localization fails.

### silentTranslationWarn

**Signature:**
```typescript
silentTranslationWarn: boolean | RegExp;
```

**Details**

Whether suppress warnings outputted when localization fails.

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### sync

**Signature:**
```typescript
sync: boolean;
```

**Details**

Whether synchronize the root level locale to the component localization locale.

**See Also**
-  [Local Scope](../guide/essentials/scope#local-scope-2)

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
-  [HTML Message](../guide/essentials/syntax#html-message)  
-  [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### d(value)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date): DateTimeFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope datetime formats than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope datetime formats.

**See Also**
-  [Datetime formatting](../guide/essentials/datetime)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |

#### Returns

 Formatted value

### d(value, key)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date, key: string): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [d](legacy#d-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |

#### Returns

 Formatted value

### d(value, key, locale)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [d](legacy#d-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### d(value, args)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date, args: {
        [key: string]: string;
    }): DateTimeFormatResult;
```

**Details**

Overloaded `d`. About details, see the [d](legacy#d-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date | A value, timestamp number or `Date` instance |
| args | {         [key: string]: string;     } | An argument values |

#### Returns

 Formatted value

### getDateTimeFormat(locale)

Get datetime format

**Signature:**
```typescript
getDateTimeFormat(locale: Locale): DateTimeFormat;
```

**Details**

get datetime format from VueI18n instance [datetimeFormats](legacy#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |

#### Returns

 Datetime format

### getLocaleMessage(locale)

Get locale message

**Signature:**
```typescript
getLocaleMessage(locale: Locale): LocaleMessageDictionary<VueMessageType>;
```

**Details**

get locale message from VueI18n instance [messages](legacy#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |

#### Returns

 Locale messages

### getNumberFormat(locale)

Get number format

**Signature:**
```typescript
getNumberFormat(locale: Locale): NumberFormat;
```

**Details**

get number format from VueI18n instance [numberFormats](legacy#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |

#### Returns

 Number format

### mergeDateTimeFormat(locale, format)

Merge datetime format

**Signature:**
```typescript
mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void;
```

**Details**

Merge datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | DateTimeFormat | A target datetime format |

### mergeLocaleMessage(locale, message)

Merge locale message

**Signature:**
```typescript
mergeLocaleMessage(locale: Locale, message: LocaleMessageDictionary<VueMessageType>): void;
```

**Details**

Merge locale message to VueI18n instance [messages](legacy#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| message | LocaleMessageDictionary&lt;VueMessageType&gt; | A message |

### mergeNumberFormat(locale, format)

Merge number format

**Signature:**
```typescript
mergeNumberFormat(locale: Locale, format: NumberFormat): void;
```

**Details**

Merge number format to VueI18n instance [numberFormats](legacy#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | NumberFormat | A target number format |

### n(value)

Number formatting

**Signature:**
```typescript
n(value: number): NumberFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope number formats than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope number formats.

**See Also**
-  [Number formatting](../guide/essentials/number)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

 Formatted value

### n(value, key)

Number formatting

**Signature:**
```typescript
n(value: number, key: string): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [n](legacy#n-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |

#### Returns

 Formatted value

### n(value, key, locale)

Number formatting

**Signature:**
```typescript
n(value: number, key: string, locale: Locale): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [n](legacy#n-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### n(value, args)

Number formatting

**Signature:**
```typescript
n(value: number, args: {
        [key: string]: string;
    }): NumberFormatResult;
```

**Details**

Overloaded `n`. About details, see the [n](legacy#n-value) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| args | {         [key: string]: string;     } | An argument values |

#### Returns

 Formatted value

### rt(message)

Resolve locale message translation

**Signature:**
```typescript
rt(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

**See Also**
-  [Scope and Locale Changing](../guide/essentials/scope)

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

### rt(message, plural, options)

Resolve locale message translation for plurals

**Signature:**
```typescript
rt(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](legacy#rt-message) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
-  [Pluralization](../guide/essentials/pluralization)

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
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### rt(message, list, options)

Resolve locale message translation for list interpolations

**Signature:**
```typescript
rt(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](legacy#rt-message) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
-  [List interpolation](../guide/essentials/syntax#list-interpolation)

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
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### rt(message, named, options)

Resolve locale message translation for named interpolations

**Signature:**
```typescript
rt(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](legacy#rt-message) details.

In this overloaded `rt`, for each placeholder x, the locale messages should contain a `{x}` token.

**See Also**
-  [Named interpolation](../guide/essentials/syntax#named-interpolation)

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
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### setDateTimeFormat(locale, format)

Set datetime format

**Signature:**
```typescript
setDateTimeFormat(locale: Locale, format: DateTimeFormat): void;
```

**Details**

Set datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | DateTimeFormat | A target datetime format |

### setLocaleMessage(locale, message)

Set locale message

**Signature:**
```typescript
setLocaleMessage(locale: Locale, message: LocaleMessageDictionary<VueMessageType>): void;
```

**Details**

Set locale message to VueI18n instance [messages](legacy#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| message | LocaleMessageDictionary&lt;VueMessageType&gt; | A message |

### setNumberFormat(locale, format)

Set number format

**Signature:**
```typescript
setNumberFormat(locale: Locale, format: NumberFormat): void;
```

**Details**

Set number format to VueI18n instance [numberFormats](legacy#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | NumberFormat | A target number format |

### t(key)

Locale message translation.

**Signature:**
```typescript
t(key: Path): TranslateResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s translated in preferentially local scope locale messages than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s translated with global scope locale messages.

**See Also**
-  [Scope and Locale Changing](../guide/essentials/scope)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |

#### Returns

 Translated message

### t(key, locale)

Locale message translation.

**Signature:**
```typescript
t(key: Path, locale: Locale): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [t](legacy#t-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Translated message

### t(key, locale, list)

Locale message translation.

**Signature:**
```typescript
t(key: Path, locale: Locale, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [t](legacy#t-key) details.

**See Also**
-  [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, it will be used over than global scope or local scope. |
| list | unknown[] | A values of list interpolation |

#### Returns

 Translated message

### t(key, locale, named)

Locale message translation.

**Signature:**
```typescript
t(key: Path, locale: Locale, named: object): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [t](legacy#t-key) details.

**See Also**
-  [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, it will be used over than global scope or local scope. |
| named | object | A values of named interpolation |

#### Returns

 Translated message

### t(key, list)

Locale message translation.

**Signature:**
```typescript
t(key: Path, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [t](legacy#t-key) details.

**See Also**
-  [List interpolation](../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

 Translated message

### t(key, named)

Locale message translation.

**Signature:**
```typescript
t(key: Path, named: Record<string, unknown>): TranslateResult;
```

**Details**

Overloaded `t`. About details, see the [t](legacy#t-key) details.

**See Also**
-  [Named interpolation](../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

 Translated message

### tc(key)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path): TranslateResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [i18n component options](injection#i18n) is specified, it’s pluraled in preferentially local scope locale messages than global scope locale messages.

If [i18n component options](injection#i18n) isn't specified, it’s pluraled with global scope locale messages.

The plural choice number is handled with default `1`.

**See Also**
-  [Pluralization](../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |

#### Returns

 Pluraled message

### tc(key, locale)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, locale: Locale): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Pluraled message

### tc(key, list)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

 Pluraled message

### tc(key, named)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, named: Record<string, unknown>): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

 Pluraled message

### tc(key, choice)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, choice: number): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Pluraled message

### tc(key, choice, locale)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, choice: number, locale: Locale): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one. |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Pluraled message

### tc(key, choice, list)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, choice: number, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one. |
| list | unknown[] | A values of list interpolation |

#### Returns

 Pluraled message

### tc(key, choice, named)

Locale message pluralization

**Signature:**
```typescript
tc(key: Path, choice: number, named: Record<string, unknown>): TranslateResult;
```

**Details**

Overloaded `tc`. About details, see the [tc](legacy#tc-key) details.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one. |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

 Pluraled message

### te(key, locale)

Translation locale message exist

**Signature:**
```typescript
te(key: Path, locale?: Locale): boolean;
```

**Details**

whether do exist locale message on VueI18n instance [messages](legacy#messages).

If you specified `locale`, check the locale messages of `locale`.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A target locale |

#### Returns

 If found locale message, `true`, else `false`

### tm(key)

Locale messages getter

**Signature:**
```typescript
tm(key: Path): LocaleMessageValue<VueMessageType> | {};
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

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key

 Locale messages |

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




## VueI18nOptions

VueI18n Options

**Signature:**
```typescript
export interface VueI18nOptions 
```

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

### componentInstanceCreatedListener

**Signature:**
```typescript
componentInstanceCreatedListener?: ComponentInstanceCreatedListener;
```

**Details**

A handler for getting notified when component-local instance was created.

The handler gets called with new and old (root) VueI18n instances.

This handler is useful when extending the root VueI18n instance and wanting to also apply those extensions to component-local instance.

**Default Value**

`null`

### datetimeFormats

**Signature:**
```typescript
datetimeFormats?: DateTimeFormatsType;
```

**Details**

The datetime formats of localization.

**Default Value**

`{}`

**See Also**
-  [Datetime Formatting](../guide/essentials/datetime)

### escapeParameterHtml

**Signature:**
```typescript
escapeParameterHtml?: boolean;
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
-  [HTML Message](../guide/essentials/syntax#html-message)

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
-  [Fallbacking](../guide/essentials/fallback)

### fallbackRoot

**Signature:**
```typescript
fallbackRoot?: boolean;
```

**Details**

In the component localization, whether to fall back to root level (global scope) localization when localization fails.

If `false`, it's not fallback to root.

**Default Value**

`true`

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### flatJson

**Signature:**
```typescript
flatJson?: boolean;
```

**Details**

Allow use flat json messages or not

**Default Value**

`false`

### formatFallbackMessages

**Signature:**
```typescript
formatFallbackMessages?: boolean;
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**Default Value**

`false`

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### formatter

**Signature:**
```typescript
formatter?: Formatter;
```

:::danger DEPRECATED
See the [here](../guide/migration/breaking#remove-custom-formatter)
:::

**Details**

The formatter that implemented with Formatter interface.

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
-  [Scope and Locale Changing](../guide/essentials/scope)

### messages

**Signature:**
```typescript
messages?: LocaleMessages<VueMessageType>;
```

**Details**

The locale messages of localization.

**Default Value**

`{}`

**See Also**
-  [Getting Started](../guide/)

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

### modifiers

**Signature:**
```typescript
modifiers?: LinkedModifiers<VueMessageType>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
-  [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)

### numberFormats

**Signature:**
```typescript
numberFormats?: NumberFormatsType;
```

**Details**

The number formats of localization.

**Default Value**

`{}`

**See Also**
-  [Number Formatting](../guide/essentials/number)

### pluralizationRules

**Signature:**
```typescript
pluralizationRules?: PluralizationRules;
```

**Details**

A set of rules for word pluralization

**Default Value**

`{}`

**See Also**
-  [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**Signature:**
```typescript
postTranslation?: PostTranslationHandler<VueMessageType>;
```

**Details**

A handler for post processing of translation. The handler gets after being called with the `$t`, `t`, `$tc`, and `tc`.

This handler is useful if you want to filter on translated text such as space trimming.

**Default Value**

`null`

### preserveDirectiveContent

**Signature:**
```typescript
preserveDirectiveContent?: boolean;
```

:::danger DEPRECATED
The `v-t` directive for Vue 3 now preserves the default content. Therefore, this option and its properties have been removed from the VueI18n instance.
:::

**Details**

Whether `v-t` directive's element should preserve `textContent` after directive is unbinded.

**Default Value**

`false`

**See Also**
-  [Custom Directive](../guide/advanced/directive)  
-  [Remove `preserveDirectiveContent` option](../guide/migration/breaking#remove-preservedirectivecontent-option)

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
-  [Shared locale messages for components](../guide/essentials/local#shared-locale-messages-for-components)

### silentFallbackWarn

**Signature:**
```typescript
silentFallbackWarn?: boolean | RegExp;
```

**Details**

Whether do template interpolation on translation keys when your language lacks a translation for a key.

If `true`, skip writing templates for your "base" language; the keys are your templates.

**Default Value**

`false`

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

### silentTranslationWarn

**Signature:**
```typescript
silentTranslationWarn?: boolean | RegExp;
```

**Details**

Whether suppress warnings outputted when localization fails.

If `true`, suppress localization fail warnings.

If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).

**Default Value**

`false`

**See Also**
-  [Fallbacking](../guide/essentials/fallback)

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
-  [Local Scope](../guide/essentials/scope#local-scope-2)

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
-  [HTML Message](../guide/essentials/syntax#html-message)  
-  [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

