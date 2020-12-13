# Component Injections

## ComponentCustomOptions

Component Custom Properties for Vue I18n

**Signature:**
```typescript
export interface ComponentCustomOptions;
```

### i18n

Vue I18n options for Component

**Signature:**
```typescript
i18n?: VueI18nOptions;
```

**See Also**
- [VueI18nOptions](legacy#vuei18noptions)

## ComponentCustomProperties

Component Custom Options for Vue I18n

**Signature:**
```typescript
export interface ComponentCustomProperties;
```

**Details**

These properties are injected into every child component

### $i18n

Exported Global Composer instance, or global VueI18n instance.

**Signature:**
```typescript
$i18n: VueI18n | ExportedGlobalComposer;
```

**Details**

You can get the [exported composer instance](general#exportedglobalcomposer) which are exported from global [composer](composition#composer) instance created with [createI18n](general#createi18n), or global [VueI18n](legacy#vuei18n) instance.

You can get the exported composer instance in [Compostion API mode](general#mode), or the Vuei18n instance in [Legacy API mode](general#mode), which is the instance you can refer to with this property.

The locales, locale messages, and other resources managed by the instance referenced by this property are valid as global scope.

If the `i18n` component option is not specified, it’s the same as the VueI18n instance that can be referenced by the i18n instance [global](general#global).

**See Also**
- [Scope and Locale Changing](../essentials/scope)
- [Composition API](../advanced/composition)

### $t(key)

Locale message translation

**Signature:**
```typescript
$t(key: Path): TranslateResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

In [Compostion API mode](general#mode), the `$t` is injected by `app.config.globalProperties`. The input / output is the same as for Composer, and it work on **global scope**. About that details, see [Composer#t](composition#t-key).

In [Legacy API mode](general#mode), the input / output is the same as for VueI18n instance. About details, see [VueI18n#t](legacy#t-key).

**See Also**
- [Scope and Locale Changing](../essentials/scope)
- [Composition API](../advanced/composition)

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |

#### Returns

Translation message

### $t(key, locale)

Locale message translation

**Signature:**
```typescript
$t(key: Path, locale: Locale): TranslateResult;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Translation message

### $t(key, locale, list)

Locale message translation

**Signature:**
```typescript
$t(key: Path, locale: Locale, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, override locale that global scope or local scope |
| list | unknown[] | A values of list interpolation |

#### Returns

Translation message

### $t(key, locale, named)

Locale message translation

**Signature:**
```typescript
$t(key: Path, locale: Locale, named: object): TranslateResult;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, override locale that global scope or local scope |
| named | object | A values of named interpolation |

#### Returns

Translation message

### $t(key, list)

Locale message translation

**Signature:**
```typescript
$t(key: Path, list: unknown[]): TranslateResult;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

Translation message

### $t(key, named)

Locale message translation

**Signature:**
```typescript
$t(key: Path, named: Record<string, unknown>): TranslateResult;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, override locale that global scope or local scope |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

Translation message

### $t(key)

Locale message translation

**Signature:**
```typescript
$t(key: Path): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |

#### Returns

Translation message

### $t(key, plural)

Locale message translation

**Signature:**
```typescript
$t(key: Path, plural: number): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| plural | number | A choice number of plural |

#### Returns

Translation message

### $t(key, plural, options)

Locale message translation

**Signature:**
```typescript
$t(key: Path, plural: number, options: TranslateOptions): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| plural | number | A choice number of plural |
| options | TranslateOptions | An options, see the [TranslateOptions](general#translateoptions) |

#### Returns

Translation message

### $t(key, defaultMsg)

Locale message translation

**Signature:**
```typescript
$t(key: Path, defaultMsg: string): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

Translation message

### $t(key, defaultMsg, options)

Locale message translation

**Signature:**
```typescript
$t(key: Path, defaultMsg: string, options: TranslateOptions): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| defaultMsg | string | A default message to return if no translation was found |
| options | TranslateOptions | An options, see the [TranslateOptions](general#translateoptions) |

#### Returns

Translation message

### $t(key, list)

Locale message translation

**Signature:**
```typescript
$t(key: Path, list: unknown[]): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

Translation message

### $t(key, list, plural)

Locale message translation

**Signature:**
```typescript
$t(key: Path, list: unknown[], plural: number): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |
| plural | number | A choice number of plural |

#### Returns

Translation message

### $t(key, list, defaultMsg)

Locale message translation

**Signature:**
```typescript
$t(key: Path, list: unknown[], defaultMsg: string): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

Translation message

### $t(key, list, options)

Locale message translation

**Signature:**
```typescript
$t(key: Path, list: unknown[], options: TranslateOptions): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |
| options | TranslateOptions | An options, see the [TranslateOptions](general#translateoptions) |

#### Returns

Translation message

### $t(key, named)

Locale message translation

**Signature:**
```typescript
$t(key: Path, named: NamedValue): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | NamedValue | A values of named interpolation |

#### Returns

Translation message

### $t(key, named, plural)

Locale message translation

**Signature:**
```typescript
$t(key: Path, named: NamedValue, plural: number): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | NamedValue | A values of named interpolation |
| plural | number | A choice number of plural |

#### Returns

Translation message

### $t(key, named, defaultMsg)

Locale message translation

**Signature:**
```typescript
$t(key: Path, named: NamedValue, defaultMsg: string): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | NamedValue | A values of named interpolation |
| defaultMsg | string | A default message to return if no translation was found |

#### Returns

Translation message

### $t(key, named, options)

Locale message translation

**Signature:**
```typescript
$t(key: Path, named: NamedValue, options: TranslateOptions): string;
```

**Details**

Overloaded `$t`. About details, see the [$t](injection#t-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | NamedValue | A values of named interpolation |
| options | TranslateOptions | An options, see the [TranslateOptions](general#translateoptions) |

#### Returns

Translation message

### $tc(key)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

The input / output is the same as for VueI18n instance. About that details, see [VueI18n#tc](legacy#tc-key).

The value of plural is handled with default `1`.

**See Also**
- [Pluralization](../essentials/pluralization)

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |

#### Returns

Translation message that is pluraled

### $tc(key, locale)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, locale: Locale): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Translation message that is pluraled

### $tc(key, list)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, list: unknown[]): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| list | unknown[] | A values of list interpolation |

#### Returns

Translation message that is pluraled

### $tc(key, named)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, named: Record<string, unknown>): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

Translation message that is pluraled

### $tc(key, choice)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, choice: number): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one |

#### Returns

Translation message that is pluraled

### $tc(key, choice, locale)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, choice: number, locale: Locale): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Translation message that is pluraled

### $tc(key, choice, list)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, choice: number, list: unknown[]): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one |
| list | unknown[] | A values of list interpolation |

#### Returns

Translation message that is pluraled

### $tc(key, choice, named)

Locale message pluralization

**Signature:**
```typescript
$tc(key: Path, choice: number, named: Record<string, unknown>): TranslateResult;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

Overloaded `$tc`. About details, see the [$tc](injection#tc-key) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| choice | number | Which plural string to get. 1 returns the first one |
| named | Record&lt;string, unknown&gt; | A values of named interpolation |

#### Returns

Translation message that is pluraled

### $te(key, locale)

Translation message exist

**Signature:**
```typescript
$te(key: Path, locale?: Locale): boolean;
```

:::tip NOTE
Supported for **Legacy API mode only**.
:::

**Details**

The input / output is the same as for VueI18n instance. About that details, see [VueI18n#te](legacy#te-key-locale)

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| key | Path | A target locale message key |
| locale | Locale | Optional, A locale, override locale that global scope or local scope |

#### Returns

If found locale message, `true`, else `false`.

### $d(value)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date): DateTimeFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

In [Compostion API mode](general#i18nmode), the input / output is the same as for VueI18n instance. About details, see [VueI18n#d](legacy#d-value).

In [Compostion API mode](general#i18nmode), the `$d` is injected by `app.config.globalProperties`. The input / output is the same as for Composer instance, and it work on **global scope**. About that details, see [Composer#d](composition#d-value).

**See Also**
- [Datetime Formatting](../essentials/datetime)
- [Scope and Locale Changing](../essentials/scope)
- [Composition API](../advanced/composition#datetime-formatting)

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |

#### Returns

Formatted value

### $d(value, key)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, key: string): DateTimeFormatResult;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |

#### Returns

Formatted value

### $d(value, key, locale)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Formatted value

### $d(value, args)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, args: { [key: string]: string }): DateTimeFormatResult;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| args | { [key: string]: string } | An argument values |

#### Returns

Formatted value

### $d(value)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date): string;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |

#### Returns

Formatted value

### $d(value, key)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, key: string): string;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |

#### Returns

Formatted value

### $d(value, key, locale)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, key: string, locale: Locale): string;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| key | string | A key of datetime formats |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Formatted value

### $d(value, options)

Datetime formating

**Signature:**
```typescript
$d(value: number | Date, options: DateTimeOptions): string;
```

**Details**

Overloaded `$d`. About details, see the [$d](injection#d-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number \| Date | A value, timestamp number or `Date` instance |
| options | DateTimeOptions | An options, see the [DateTimeOptions](general#datetimeoptions) |

#### Returns

Formatted value

### $n(value)

Number formatting

**Signature:**
```typescript
$n(value: number): NumberFormatResult;
```

**Details**

If this is used in a reactive context, it will re-evaluate once the locale changes.

In [Legacy API mode](general#i18nmode), the input / output is the same as for VueI18n instance. About details, see [VueI18n#n](legacy#n-value).

In [Compostion API mode](general#i18nmode), the `$n` is injected by `app.config.globalProperties`. The input / output is the same as for Composer instance, and it work on **global scope**. About that details, see [Composer#n](composition#n-value).

**See Also**
- [Number Formatting](../essentials/number)
- [Scope and Locale Changing](../essentials/scope)
- [Composition API](../advanced/composition#number-formatting)

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

Formatted value

### $n(value, key)

Number formatting

**Signature:**
```typescript
$n(value: number, key: string): NumberFormatResult;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |

#### Returns

Formatted value

### $n(value, key, locale)

Number formatting

**Signature:**
```typescript
$n(value: number, key: string, locale: Locale): NumberFormatResult;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Formatted value

### $n(value, args)

Number formatting

**Signature:**
```typescript
$n(value: number, args: { [key: string]: string }): NumberFormatResult;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| args | { [key: string]: string } | An argument values |

#### Returns

Formatted value

### $n(value)

Number formatting

**Signature:**
```typescript
$n(value: number): string;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |

#### Returns

Formatted value

### $n(value, key)

Number formatting

**Signature:**
```typescript
$n(value: number, key: string): string;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |

#### Returns

Formatted value

### $n(value, key, locale)

Number formatting

**Signature:**
```typescript
$n(value: number, key: string, locale: Locale): string;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| key | string | A key of number formats |
| locale | Locale | A locale, override locale that global scope or local scope |

#### Returns

Formatted value

### $n(value, options)

Number formatting

**Signature:**
```typescript
$n(value: number, options: NumberOptions): string;
```

**Details**

Overloaded `$n`. About details, see the [$n](injection#n-value) remarks.

#### Parameters
| Parameter | Type | Description |
| --- | --- | --- |
| value | number | A number value |
| options | NumberOptions | An options, see the [NumberOptions](general#numberoptions) |

#### Returns

Formatted value
