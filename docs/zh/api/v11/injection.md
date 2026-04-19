# 组件注入


## ComponentCustomOptions

Vue I18n 的组件自定义选项

**签名：**
```typescript
export interface ComponentCustomOptions;
```

### i18n

组件的 Vue I18n 选项

**签名：**
```typescript
i18n?: VueI18nOptions;
```

**另请参阅**
- [VueI18nOptions](legacy#vuei18noptions)

## ComponentCustomProperties

Vue I18n 的组件自定义选项

**签名：**
```typescript
export interface ComponentCustomProperties;
```

**详情**

这些属性被注入到每个子组件中

### $i18n

导出的全局 Composer 实例，或全局 VueI18n 实例。

**签名：**
```typescript
$i18n: VueI18n | ExportedGlobalComposer;
```

**详情**

您可以获取从使用 [createI18n](general#createi18n) 创建的全局 [composer](composition#composer) 实例导出的 [exported composer instance](general#exportedglobalcomposer)，或全局 [VueI18n](legacy#vuei18n) 实例。

您可以在 [组合式 API 模式](general#mode) 下获取导出的 composer 实例，或者在 [Legacy API 模式](general#mode) 下获取 Vuei18n 实例，这是您可以使用此属性引用的实例。

由此属性引用的实例管理的语言环境、语言环境消息和其他资源在全局范围内有效。

如果未指定 `i18n` 组件选项，则与可以通过 i18n 实例 [global](general#global) 引用的 VueI18n 实例相同。

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)
- [组合式 API](../../guide/advanced/composition)

### $t(key)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key): TranslateResult;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

在 [组合式 API 模式](general#mode) 下，`$t` 由 `app.config.globalProperties` 注入。输入/输出与 Composer 相同，并且它在**全局作用域**上工作。关于该详细信息，请参阅 [Composer#t](composition#t-key)。

在 [Legacy API 模式](general#mode) 下，输入/输出与 VueI18n 实例相同。关于详细信息，请参阅 [VueI18n#t](legacy#t-key)。

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)
- [组合式 API](../../guide/advanced/composition)

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |

#### 返回值

翻译消息

### $t(key, locale)

:::danger 注意
**此 API 签名仅在 Legacy API 模式下可用，并且支持直到 v9**。
:::

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, locale: Locale): TranslateResult;
```

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |

#### 返回值

翻译消息

### $t(key, locale, list)

:::danger 注意
**此 API 签名仅在 Legacy API 模式下可用，并且支持直到 v9**。
:::

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;
```

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |
| list | unknown[] | 列表插值的值 |

#### 返回值

翻译消息

### $t(key, locale, named)

:::danger 注意
**此 API 签名仅在 Legacy API 模式下可用，并且支持直到 v9**。
:::

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, locale: Locale, named: object): TranslateResult;
```

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |
| named | object | 命名插值的值 |

#### 返回值

翻译消息

### $t(key, plural)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, plural: number): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| plural | number | 复数选择数字 |

#### 返回值

翻译消息

### $t(key, plural, options)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| plural | number | 复数选择数字 |
| options | TranslateOptions | 选项，请参阅 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $t(key, defaultMsg)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, defaultMsg: string): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### $t(key, defaultMsg, options)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, defaultMsg: string, options: TranslateOptions): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |
| options | TranslateOptions | 选项，请参阅 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $t(key, list)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, list: unknown[]): TranslateResult;
```

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |

#### 返回值

翻译消息

### $t(key, list, plural)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, list: unknown[], plural: number): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| plural | number | 复数选择数字 |

#### 返回值

翻译消息

### $t(key, list, defaultMsg)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, list: unknown[], defaultMsg: string): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### $t(key, list, options)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| list | unknown[] | 列表插值的值 |
| options | TranslateOptions | 选项，请参阅 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $t(key, named)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, named: NamedValue): TranslateResult;
```

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |

#### 返回值

翻译消息

### $t(key, named, plural)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, named: NamedValue, plural: number): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| plural | number | 复数选择数字 |

#### 返回值

翻译消息

### $t(key, named, defaultMsg)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, named: NamedValue, defaultMsg: string): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| defaultMsg | string | 如果未找到翻译则返回的默认消息 |

#### 返回值

翻译消息

### $t(key, named, options)

语言环境消息翻译

**签名：**
```typescript
$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;
```

:::tip 注意
仅支持 **组合式 API 模式直到 v9。v10 或更高版本也可以在 Legacy API 模式下使用**。
:::

**详情**

重载的 `$t`。关于详细信息，请参阅 [$t](injection#t-key) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| named | NamedValue | 命名插值的值 |
| options | TranslateOptions | 选项，请参阅 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $rt(message)

解析语言环境消息翻译

**签名：**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

在 [组合式 API 模式](general#mode) 下，`$rt` 由 `app.config.globalProperties` 注入。输入/输出与 Composer 相同，并且它在**全局作用域**上工作。关于该详细信息，请参阅 [Composer#rt](composition#rt-message)。

在 [Legacy API 模式](general#mode) 下，输入/输出与 VueI18n 实例相同。关于详细信息，请参阅 [VueI18n#rt](legacy#rt-message)。

**另请参阅**
- [作用域和区域设置更改](../../guide/essentials/scope)
- [组合式 API](../../guide/advanced/composition)

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 要解析的目标语言环境消息。您需要指定 `$tm` 返回的语言环境消息。 |

#### 返回值

翻译消息

### $rt(message, plural, options)

解析复数的语言环境消息翻译

**签名：**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslationOptions): string;
```

**详情**

重载的 `$rt`。关于详细信息，请参阅 [$rt](injection#rt-message) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 要解析的目标语言环境消息。您需要指定 `$tm` 返回的语言环境消息。 |
| plural | number | 获取哪个复数字符串。`1` 返回第一个。 |
| options | TranslateOptions | 附加 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $rt(message, list, options)

解析列表插值的语言环境消息翻译

**签名：**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslationOptions): string;
```

**详情**

重载的 `$rt`。关于详细信息，请参阅 [$rt](injection#rt-message) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 要解析的目标语言环境消息。您需要指定 `$tm` 返回的语言环境消息。 |
| list | unknown[] | 列表插值的值。 |
| options | TranslateOptions | 附加 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $rt(message, named, options)

解析命名插值的语言环境消息翻译

**签名：**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslationOptions): string;
```

**详情**

重载的 `$rt`。关于详细信息，请参阅 [$rt](injection#rt-message) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 要解析的目标语言环境消息。您需要指定 `$tm` 返回的语言环境消息。 |
| named | NamedValue | 命名插值的值。 |
| options | TranslateOptions | 附加 [TranslateOptions](general#translateoptions) |

#### 返回值

翻译消息

### $te(key, locale)

翻译消息是否存在

**签名：**
```typescript
$te(key: Key, locale?: Locale): boolean;
```

**详情**

关于详细信息，请参阅 [VueI18n#te](legacy#te-key-locale)

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |
| locale | Locale | 可选，语言环境，覆盖全局作用域或本地作用域 |

#### 返回值

如果找到语言环境消息，则为 `true`，否则为 `false`。

### $tm(key)

语言环境消息获取器

**签名：**
```typescript
$tm(key: Key): LocaleMessageValue<VueMessageType> | {}
```

**详情**

如果指定了 [i18n component options](injection#i18n)，则优先在本地作用域语言环境消息中获取，而不是全局作用域语言环境消息。

如果未指定 [i18n component options](injection#i18n)，则使用全局作用域语言环境消息获取。

基于当前 `locale`，将从 Composer 实例消息返回语言环境消息。

如果您更改 `locale`，返回的语言环境消息也将对应于该语言环境。

如果 Composer 实例消息中没有给定 `key` 的语言环境消息，则将通过[回退](../../guide/essentials/fallback)返回。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| key | Key | 目标语言环境消息键 |

#### 返回值

语言环境消息

:::warning 注意
您需要对 `$tm` 返回的语言环境消息使用 `$rt`。
:::

### $d(value)

日期时间格式化

**签名：**
```typescript
$d(value: number | Date): DateTimeFormatResult | string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

在 [组合式 API 模式](general#i18nmode) 下，输入/输出与 VueI18n 实例相同。关于详细信息，请参阅 [VueI18n#d](legacy#d-value)。

在 [组合式 API 模式](general#i18nmode) 下，`$d` 由 `app.config.globalProperties` 注入。输入/输出与 Composer 实例相同，并且它在**全局作用域**上工作。关于该详细信息，请参阅 [Composer#d](composition#d-value)。

**另请参阅**
- [日期时间格式化](../../guide/essentials/datetime)
- [作用域和区域设置更改](../../guide/essentials/scope)
- [组合式 API](../../guide/advanced/composition#datetime-formatting)

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number \| Date | 值，时间戳数字或 `Date` 实例 |

#### 返回值

格式化后的值

### $d(value, key)

日期时间格式化

**签名：**
```typescript
$d(value: number | Date, key: string): DateTimeFormatResult | string;
```

**详情**

重载的 `$d`。关于详细信息，请参阅 [$d](injection#d-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number \| Date | 值，时间戳数字或 `Date` 实例 |
| key | string | 日期时间格式的键 |

#### 返回值

格式化后的值

### $d(value, key, locale)

日期时间格式化

**签名：**
```typescript
$d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult | string;
```

**详情**

重载的 `$d`。关于详细信息，请参阅 [$d](injection#d-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number \| Date | 值，时间戳数字或 `Date` 实例 |
| key | string | 日期时间格式的键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |

#### 返回值

格式化后的值

### $d(value, args)

日期时间格式化

**签名：**
```typescript
$d(value: number | Date, args: { [key: string]: string | boolean | number }): DateTimeFormatResult;
```

**详情**

重载的 `$d`。关于详细信息，请参阅 [$d](injection#d-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number \| Date | 值，时间戳数字或 `Date` 实例 |
| args | { [key: string]: string } | 参数值 |

#### 返回值

格式化后的值

### $d(value, options)

日期时间格式化

**签名：**
```typescript
$d(value: number | Date, options: DateTimeOptions): string;
```

**详情**

重载的 `$d`。关于详细信息，请参阅 [$d](injection#d-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number \| Date | 值，时间戳数字或 `Date` 实例 |
| options | DateTimeOptions | 选项，请参阅 [DateTimeOptions](general#datetimeoptions) |

#### 返回值

格式化后的值

### $n(value)

数字格式化

**签名：**
```typescript
$n(value: number): NumberFormatResult | string;
```

**详情**

如果在响应式上下文中使用，它将在语言环境更改后重新评估。

在 [Legacy API 模式](general#i18nmode) 下，输入/输出与 VueI18n 实例相同。关于详细信息，请参阅 [VueI18n#n](legacy#n-value)。

在 [组合式 API 模式](general#i18nmode) 下，`$n` 由 `app.config.globalProperties` 注入。输入/输出与 Composer 实例相同，并且它在**全局作用域**上工作。关于该详细信息，请参阅 [Composer#n](composition#n-value)。

**另请参阅**
- [数字格式化](../../guide/essentials/number)
- [作用域和区域设置更改](../../guide/essentials/scope)
- [组合式 API](../../guide/advanced/composition#number-formatting)

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |

#### 返回值

格式化后的值

### $n(value, key)

数字格式化

**签名：**
```typescript
$n(value: number, key: string): NumberFormatResult | string;
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | string | 数字格式的键 |

#### 返回值

格式化后的值

### $n(value, key, locale)

数字格式化

**签名：**
```typescript
$n(value: number, key: string, locale: Locale): NumberFormatResult | string;
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | string | 数字格式的键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |

#### 返回值

格式化后的值

### $n(value, args)

数字格式化

**签名：**
```typescript
$n(value: number, args: { [key: string]: string | boolean | number }): NumberFormatResult;
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| args | { [key: string]: string } | 参数值 |

#### 返回值

格式化后的值

### $n(value, key, args)

数字格式化

**签名：**
```typescript
$n(value: number, key: string, args: { [key: string]: string | boolean | number }): NumberFormatResult
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | string | 数字格式的键 |
| args | { [key: string]: string } | 参数值 |

#### 返回值

格式化后的值

### $n(value, key, locale, args)

数字格式化

**签名：**
```typescript
$n(value: number, key: string, locale: Locale, args: { [key: string]: string | boolean | number }): NumberFormatResult
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| key | string | 数字格式的键 |
| locale | Locale | 语言环境，覆盖全局作用域或本地作用域 |
| args | { [key: string]: string } | 参数值 |

#### 返回值

格式化后的值

### $n(value, options)

数字格式化

**签名：**
```typescript
$n(value: number, options: NumberOptions): string;
```

**详情**

重载的 `$n`。关于详细信息，请参阅 [$n](injection#n-value) 说明。

#### 参数
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| value | number | 数字值 |
| options | NumberOptions | 选项，请参阅 [NumberOptions](general#numberoptions) |

#### 返回值

格式化后的值
