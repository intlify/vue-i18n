# Composition API

## Composer

Composer interfaces

**Signature:**
```typescript
export interface Composer<Messages = {}, DateTimeFormats = {}, NumberFormats = {}, Message = VueMessageType> 
```

**Details**

This is the interface for being used for Vue 3 Composition API.

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
readonly datetimeFormats: ComputedRef<DateTimeFormats>;
```

**Details**

The datetime formats of localization.

**See Also**
-  [Datetime Formatting](../../guide/essentials/datetime)

### escapeParameter

**Signature:**
```typescript
escapeParameter: boolean;
```

**Details**

Whether interpolation parameters are escaped before the message is translated.

**See Also**
-  [HTML Message](../../guide/essentials/syntax#html-message)

### fallbackFormat

**Signature:**
```typescript
fallbackFormat: boolean;
```

**Details**

Whether suppress warnings when falling back to either `fallbackLocale` or root.

**See Also**
-  [Fallbacking](../../guide/essentials/fallback)

### fallbackLocale

**Signature:**
```typescript
fallbackLocale: WritableComputedRef<FallbackLocale>;
```

**Details**

The current fallback locales this Composer instance is using.

**See Also**
-  [Fallbacking](../../guide/essentials/fallback)

### fallbackRoot

**Signature:**
```typescript
fallbackRoot: boolean;
```

**Details**

Whether to fall back to root level (global scope) localization when localization fails.

**See Also**
-  [Fallbacking](../../guide/essentials/fallback)

### fallbackWarn

**Signature:**
```typescript
fallbackWarn: boolean | RegExp;
```

**Details**

Whether suppress fall back warnings when localization fails.

**See Also**
-  [Fallbacking](../../guide/essentials/fallback)

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
-  [Local Scope](../../guide/essentials/scope#local-scope-2)

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
locale: WritableComputedRef<Locale>;
```

**Details**

The current locale this Composer instance is using.

If the locale contains a territory and a dialect, this locale contains an implicit fallback.

**See Also**
-  [Scope and Locale Changing](../../guide/essentials/scope)

### messages

**Signature:**
```typescript
readonly messages: ComputedRef<Messages>;
```

**Details**

The locale messages of localization.

**See Also**
-  [Getting Started](../../guide/)

### missingWarn

**Signature:**
```typescript
missingWarn: boolean | RegExp;
```

**Details**

Whether suppress warnings outputted when localization fails.

**See Also**
-  [Fallbacking](../../guide/essentials/fallback)

### modifiers

**Signature:**
```typescript
readonly modifiers: LinkedModifiers<Message>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
-  [Custom Modifiers](../../guide/essentials/syntax#custom-modifiers)

### numberFormats

**Signature:**
```typescript
readonly numberFormats: ComputedRef<NumberFormats>;
```

**Details**

The number formats of localization.

**See Also**
-  [Number Formatting](../../guide/essentials/number)

### pluralRules

**Signature:**
```typescript
readonly pluralRules: PluralizationRules;
```

**Details**

A set of rules for word pluralization

**See Also**
-  [Custom Pluralization](../../guide/essentials/pluralization#custom-pluralization)

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
-  [HTML Message](../../guide/essentials/syntax#html-message)  
-  [Change `warnHtmlInMessage` option default value](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### d(value)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date | string): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.

If not, then it’s formatted with global scope datetime formats.

**See Also**
-  [Datetime formatting](../../guide/essentials/datetime)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date &#124; string | A value, timestamp number or `Date` instance or ISO 8601 string |

#### Returns

 Formatted value

### d(value, key)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date | string, key: string): string;
```

**Details**

Overloaded `d`. About details, see the [d](composition#d-value) details.

In this overloaded `d`, format in datetime format for a key registered in datetime formats.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date &#124; string | A value, timestamp number or `Date` instance or ISO 8601 string |
| key | string | A key of datetime formats |

#### Returns

 Formatted value

### d(value, key, locale)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date | string, key: string, locale: Locale): string;
```

**Details**

Overloaded `d`. About details, see the [d](composition#d-value) details.

In this overloaded `d`, format in datetime format for a key registered in datetime formats at target locale

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date &#124; string | A value, timestamp number or `Date` instance or ISO 8601 string |
| key | string | A key of datetime formats |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### d(value, options)

Datetime formatting

**Signature:**
```typescript
d(value: number | Date | string, options: DateTimeOptions): string;
```

**Details**

Overloaded `d`. About details, see the [d](composition#d-value) details.

You can also suppress the warning, when the formatting missing according to the options.

About details of options, see the .

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number &#124; Date &#124; string | A value, timestamp number or `Date` instance or ISO 8601 string |
| options | DateTimeOptions | Additional  for datetime formatting |

#### Returns

 Formatted value

### getDateTimeFormat(locale)

Get datetime format

**Signature:**
```typescript
getDateTimeFormat(locale: Locale): DateTimeFormat;
```

**Details**

get datetime format from Composer instance [datetimeFormats](composition#datetimeformats).

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
getLocaleMessage(locale: Locale): LocaleMessageDictionary<Message>;
```

**Details**

get locale message from Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |

#### Returns

 Locale messages

### getMissingHandler()

Get missing handler

**Signature:**
```typescript
getMissingHandler(): MissingHandler | null;
```

**See Also**
-  [missing](composition#missing)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |

#### Returns

 [MissingHandler](composition#missinghandler)

### getNumberFormat(locale)

Get number format

**Signature:**
```typescript
getNumberFormat(locale: Locale): NumberFormat;
```

**Details**

get number format from Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |

#### Returns

 Number format

### getPostTranslationHandler()

Get post translation handler

**Signature:**
```typescript
getPostTranslationHandler(): PostTranslationHandler<Message> | null;
```

**See Also**
-  [missing](composition#posttranslation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |

#### Returns

 

### mergeDateTimeFormat(locale, format)

Merge datetime format

**Signature:**
```typescript
mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void;
```

**Details**

Merge datetime format to Composer instance [datetimeFormats](composition#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | DateTimeFormat | A target datetime format |

### mergeLocaleMessage(locale, message)

Merge locale message

**Signature:**
```typescript
mergeLocaleMessage(locale: Locale, message: LocaleMessageDictionary<Message>): void;
```

**Details**

Merge locale message to Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| message | LocaleMessageDictionary&lt;Message&gt; | A message |

### mergeNumberFormat(locale, format)

Merge number format

**Signature:**
```typescript
mergeNumberFormat(locale: Locale, format: NumberFormat): void;
```

**Details**

Merge number format to Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | NumberFormat | A target number format |

### n(value)

Number Formatting

**Signature:**
```typescript
n(value: number): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.

If not, then it’s formatted with global scope number formats.

**See Also**
-  [Number formatting](../../guide/essentials/number)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

 Formatted value

### n(value, key)

Number Formatting

**Signature:**
```typescript
n(value: number, key: string): string;
```

**Details**

Overloaded `n`. About details, see the [n](composition#n-value) details.

In this overloaded `n`, format in number format for a key registered in number formats.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |

#### Returns

 Formatted value

### n(value, key, locale)

Number Formatting

**Signature:**
```typescript
n(value: number, key: string, locale: Locale): string;
```

**Details**

Overloaded `n`. About details, see the [n](composition#n-value) details.

In this overloaded `n`, format in number format for a key registered in number formats at target locale.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |
| locale | Locale | A locale, it will be used over than global scope or local scope. |

#### Returns

 Formatted value

### n(value, options)

Number Formatting

**Signature:**
```typescript
n(value: number, options: NumberOptions): string;
```

**Details**

Overloaded `n`. About details, see the [n](composition#n-value) details.

You can also suppress the warning, when the formatting missing according to the options.

About details of options, see the .

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| options | NumberOptions | Additional  for number formatting |

#### Returns

 Formatted value

### rt(message)

Resolve locale message translation

**Signature:**
```typescript
rt(message: MessageFunction<Message> | Message): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

If not, then it’s translated with global scope locale messages.

**See Also**
-  [Scope and Locale Changing](../../guide/essentials/scope)

:::tip
 The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
 `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;Message&gt; &#124; Message | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |

#### Returns

 Translated message

### rt(message, plural, options)

Resolve locale message translation for plurals

**Signature:**
```typescript
rt(message: MessageFunction<Message> | Message, plural: number, options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](composition#rt-message) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
-  [Pluralization](../../guide/essentials/pluralization)

:::tip
 The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
 `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;Message&gt; &#124; Message | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
| plural | number | Which plural string to get. 1 returns the first one. |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### rt(message, list, options)

Resolve locale message translation for list interpolations

**Signature:**
```typescript
rt(message: MessageFunction<Message> | Message, list: unknown[], options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](composition#rt-message) details.

In this overloaded `rt`, return a pluralized translation message.

**See Also**
-  [List interpolation](../../guide/essentials/syntax#list-interpolation)

:::tip
 The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
 `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;Message&gt; &#124; Message | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
| list | unknown[] | A values of list interpolation. |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### rt(message, named, options)

Resolve locale message translation for named interpolations

**Signature:**
```typescript
rt(message: MessageFunction<Message> | Message, named: NamedValue, options?: TranslateOptions): string;
```

**Details**

Overloaded `rt`. About details, see the [rt](composition#rt-message) details.

In this overloaded `rt`, for each placeholder x, the locale messages should contain a `{x}` token.

**See Also**
-  [Named interpolation](../../guide/essentials/syntax#named-interpolation)

:::tip
 The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
:::

:::warning
 `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| message | MessageFunction&lt;Message&gt; &#124; Message | A target locale message to be resolved. You will need to specify the locale message returned by `tm`. |
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

Set datetime format to Composer instance [datetimeFormats](composition#datetimeformats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | DateTimeFormat | A target datetime format |

### setLocaleMessage(locale, message)

Set locale message

**Signature:**
```typescript
setLocaleMessage(locale: Locale, message: LocaleMessageDictionary<Message>): void;
```

**Details**

Set locale message to Composer instance [messages](composition#messages).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| message | LocaleMessageDictionary&lt;Message&gt; | A message |

### setMissingHandler(handler)

Set missing handler

**Signature:**
```typescript
setMissingHandler(handler: MissingHandler | null): void;
```

**See Also**
-  [missing](composition#missing)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| handler | MissingHandler &#124; null | A [MissingHandler](composition#missinghandler) |

### setNumberFormat(locale, format)

Set number format

**Signature:**
```typescript
setNumberFormat(locale: Locale, format: NumberFormat): void;
```

**Details**

Set number format to Composer instance [numberFormats](composition#numberFormats).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| locale | Locale | A target locale |
| format | NumberFormat | A target number format |

### setPostTranslationHandler(handler)

Set post translation handler

**Signature:**
```typescript
setPostTranslationHandler(handler: PostTranslationHandler<Message> | null): void;
```

**See Also**
-  [missing](composition#posttranslation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| handler | PostTranslationHandler&lt;Message&gt; &#124; null | A  |

### t(key)

Locale message translation

**Signature:**
```typescript
t(key: Path | number): string;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

If not, then it’s translated with global scope locale messages.

**See Also**
-  [Scope and Locale Changing](../../guide/essentials/scope)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |

#### Returns

 Translated message

### t(key, plural, options)

Locale message translation for plurals

**Signature:**
```typescript
t(key: Path | number, plural: number, options?: TranslateOptions): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, return a pluralized translation message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
-  [Pluralization](../../guide/essentials/pluralization)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| plural | number | Which plural string to get. 1 returns the first one. |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### t(key, defaultMsg, options)

Locale message translation for missing default message

**Signature:**
```typescript
t(key: Path | number, defaultMsg: string, options?: TranslateOptions): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, if no translation was found, return a default message.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### t(key, list, options)

Locale message translation for list interpolations

**Signature:**
```typescript
t(key: Path | number, list: unknown[], options?: TranslateOptions): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
-  [List interpolation](../../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### t(key, list, plural)

Locale message translation for list interpolations and plurals

**Signature:**
```typescript
t(key: Path | number, list: unknown[], plural: number): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.

**See Also**
-  [Pluralization](../../guide/essentials/pluralization)  
-  [List interpolation](../../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### t(key, list, defaultMsg)

Locale message translation for list interpolations and missing default message

**Signature:**
```typescript
t(key: Path | number, list: unknown[], defaultMsg: string): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.

**See Also**
-  [List interpolation](../../guide/essentials/syntax#list-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| list | unknown[] | A values of list interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### t(key, named, options)

Locale message translation for named interpolations

**Signature:**
```typescript
t(key: Path | number, named: NamedValue, options?: TranslateOptions): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.

You can also suppress the warning, when the translation missing according to the options.

About details of options, see the .

**See Also**
-  [Named interpolation](../../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| options | TranslateOptions | Additional  for translation |

#### Returns

 Translated message

### t(key, named, plural)

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
t(key: Path | number, named: NamedValue, plural: number): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.

**See Also**
-  [Pluralization](../../guide/essentials/pluralization)  
-  [Named interpolation](../../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| plural | number | Which plural string to get. 1 returns the first one. |

#### Returns

 Translated message

### t(key, named, defaultMsg)

Locale message translation for named interpolations and plurals

**Signature:**
```typescript
t(key: Path | number, named: NamedValue, defaultMsg: string): string;
```

**Details**

Overloaded `t`. About details, see the [t](composition#t-key) details.

In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.

**See Also**
-  [Named interpolation](../../guide/essentials/syntax#named-interpolation)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path &#124; number | A target locale message key |
| named | NamedValue | A values of named interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

 Translated message

### te(key, locale)

Translation locale message exist

**Signature:**
```typescript
te(key: Path, locale?: Locale): boolean;
```

**Details**

whether do exist locale message on Composer instance [messages](composition#messages).

If you specified `locale`, check the locale messages of `locale`.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, it will be used over than global scope or local scope |

#### Returns

 If found locale message, `true`, else `false`

### tm(key)

Locale messages getter

**Signature:**
```typescript
tm(key: Path): LocaleMessageValue<Message> | {};
```

**Details**

If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.

Based on the current `locale`, locale messages will be returned from Composer instance messages.

If you change the `locale`, the locale messages returned will also correspond to the locale.

If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../../guide/essentials/fallback).

:::warning
 You need to use `rt` for the locale message returned by `tm`. see the [rt](composition#rt-message) details.
:::

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key

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
-  [useI18n](composition#usei18n)

### useScope

## ComposerOptions

Composer Options

**Signature:**
```typescript
export interface ComposerOptions<Message = VueMessageType> 
```

**Details**

This is options to create composer.

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
-  [Datetime Formatting](../../guide/essentials/datetime)

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
-  [HTML Message](../../guide/essentials/syntax#html-message)

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
-  [Fallbacking](../../guide/essentials/fallback)

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
-  [Fallbacking](../../guide/essentials/fallback)

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
-  [Fallbacking](../../guide/essentials/fallback)

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
-  [Fallbacking](../../guide/essentials/fallback)

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
-  [Local Scope](../../guide/essentials/scope#local-scope-2)

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
-  [Scope and Locale Changing](../../guide/essentials/scope)

### messages

**Signature:**
```typescript
messages?: LocaleMessages<Message>;
```

**Details**

The locale messages of localization.

**Default Value**

`{}`

**See Also**
-  [Getting Started](../../guide/)

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
-  [Fallbacking](../../guide/essentials/fallback)

### modifiers

**Signature:**
```typescript
modifiers?: LinkedModifiers<Message>;
```

**Details**

Custom Modifiers for linked messages.

**See Also**
-  [Custom Modifiers](../../guide/essentials/syntax#custom-modifiers)

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
-  [Number Formatting](../../guide/essentials/number)

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
-  [Custom Pluralization](../../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**Signature:**
```typescript
postTranslation?: PostTranslationHandler<Message>;
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
-  [HTML Message](../../guide/essentials/syntax#html-message)  
-  [Change `warnHtmlInMessage` option default value](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

## MissingHandler

**Signature:**
```typescript
export declare type MissingHandler = (locale: Locale, key: Path, insttance?: ComponentInternalInstance, type?: string) => string | void;
```

## useI18n

Use Composition API for Vue I18n

**Signature:**
```typescript
export declare function useI18n<Options extends UseI18nOptions = object, Messages extends Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>> = Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>>, DateTimeFormats extends Record<keyof Options['datetimeFormats'], DateTimeFormat> = Record<keyof Options['datetimeFormats'], DateTimeFormat>, NumberFormats extends Record<keyof Options['numberFormats'], NumberFormat> = Record<keyof Options['numberFormats'], NumberFormat>>(options?: Options): Composer<Options['messages'], Options['datetimeFormats'], Options['numberFormats']>;
```

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
export declare type UseI18nOptions = ComposerAdditionalOptions & ComposerOptions;
```

**Details**

`UseI18nOptions` is inherited [ComposerAdditionalOptions](composition#composeradditionaloptions) and [ComposerOptions](composition#composeroptions), so you can specify these options.

**See Also**
-  [useI18n](composition#usei18n)

## VueMessageType

**Signature:**
```typescript
export declare type VueMessageType = string | VNode;
```

