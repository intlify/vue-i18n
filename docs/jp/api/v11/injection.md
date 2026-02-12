# コンポーネントインジェクション

## ComponentCustomOptions

Vue I18n のためのコンポーネントカスタムオプション

**シグネチャ:**
```typescript
export interface ComponentCustomOptions;
```

### i18n

コンポーネントのための Vue I18n オプション

**シグネチャ:**
```typescript
i18n?: VueI18nOptions;
```

**参照**
- [VueI18nOptions](legacy#vuei18noptions)

## ComponentCustomProperties

Vue I18n のためのコンポーネントカスタムプロパティ

**シグネチャ:**
```typescript
export interface ComponentCustomProperties;
```

**詳細**

これらのプロパティはすべての子コンポーネントに注入されます。

### $i18n

エクスポートされたグローバル Composer インスタンス、またはグローバル VueI18n インスタンス。

**シグネチャ:**
```typescript
$i18n: VueI18n | ExportedGlobalComposer;
```

**詳細**

[createI18n](general#createi18n) で作成されたグローバル [composer](composition#composer) インスタンスからエクスポートされた [exported composer instance](general#exportedglobalcomposer)、またはグローバル [VueI18n](legacy#vuei18n) インスタンスを取得できます。

[Composition API モード](general#mode) ではエクスポートされた Composer インスタンスを取得でき、[Legacy API モード](general#mode) では VueI18n インスタンスを取得できます。

このプロパティによって参照されるインスタンスによって管理されるロケール、ロケールメッセージ、およびその他のリソースは、グローバルスコープとして有効です。

`i18n` コンポーネントオプションが指定されていない場合、i18n インスタンス [global](general#global) によって参照できる VueI18n インスタンスと同じになります。

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)
- [Composition API](../../guide/advanced/composition)

### $t(key)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key): TranslateResult;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[Composition API モード](general#mode) では、`$t` は `app.config.globalProperties` によって注入されます。入出力は Composer と同じで、**グローバルスコープ**で動作します。詳細については、[Composer#t](composition#t-key) を参照してください。

[Legacy API モード](general#mode) では、入出力は VueI18n インスタンスと同じです。詳細については、[VueI18n#t](legacy#t-key) を参照してください。

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)
- [Composition API](../../guide/advanced/composition)

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |

#### 戻り値

翻訳メッセージ

### $t(key, locale)

:::danger 注意
**この API シグネチャは Legacy API モードでのみ利用可能で、v9 までサポートされます**。
:::

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, locale: Locale): TranslateResult;
```

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |

#### 戻り値

翻訳メッセージ

### $t(key, locale, list)

:::danger 注意
**この API シグネチャは Legacy API モードでのみ利用可能で、v9 までサポートされます**。
:::

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, locale: Locale, list: unknown[]): TranslateResult;
```

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |
| list | unknown[] | リスト補間の値 |

#### 戻り値

翻訳メッセージ

### $t(key, locale, named)

:::danger 注意
**この API シグネチャは Legacy API モードでのみ利用可能で、v9 までサポートされます**。
:::

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, locale: Locale, named: object): TranslateResult;
```

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |
| named | object | 名前付き補間の値 |

#### 戻り値

翻訳メッセージ

### $t(key, plural)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, plural: number): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| plural | number | 複数形の選択番号 |

#### 戻り値

翻訳メッセージ

### $t(key, plural, options)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, plural: number, options: TranslateOptions): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| plural | number | 複数形の選択番号 |
| options | TranslateOptions | オプション。[TranslateOptions](general#translateoptions) を参照 |

#### 戻り値

翻訳メッセージ

### $t(key, defaultMsg)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, defaultMsg: string): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳メッセージ

### $t(key, defaultMsg, options)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, defaultMsg: string, options: TranslateOptions): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |
| options | TranslateOptions | オプション。[TranslateOptions](general#translateoptions) を参照 |

#### 戻り値

翻訳メッセージ

### $t(key, list)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, list: unknown[]): TranslateResult;
```

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |

#### 戻り値

翻訳メッセージ

### $t(key, list, plural)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, list: unknown[], plural: number): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| plural | number | 複数形の選択番号 |

#### 戻り値

翻訳メッセージ

### $t(key, list, defaultMsg)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, list: unknown[], defaultMsg: string): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳メッセージ

### $t(key, list, options)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, list: unknown[], options: TranslateOptions): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| options | TranslateOptions | オプション。[TranslateOptions](general#translateoptions) を参照 |

#### 戻り値

翻訳メッセージ

### $t(key, named)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, named: NamedValue): TranslateResult;
```

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |

#### 戻り値

翻訳メッセージ

### $t(key, named, plural)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, named: NamedValue, plural: number): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| plural | number | 複数形の選択番号 |

#### 戻り値

翻訳メッセージ

### $t(key, named, defaultMsg)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, named: NamedValue, defaultMsg: string): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳メッセージ

### $t(key, named, options)

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
$t(key: Key, named: NamedValue, options: TranslateOptions): TranslateResult;
```

:::tip メモ
**Composition API モードのみ v9 までサポートされています。v10 以降は Legacy API モードでも使用できます**。
:::

**詳細**

オーバーロードされた `$t`。詳細については、[$t](injection#t-key) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| options | TranslateOptions | オプション。[TranslateOptions](general#translateoptions) を参照 |

#### 戻り値

翻訳メッセージ

### $rt(message)

ロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[Composition API モード](general#mode) では、`$rt` は `app.config.globalProperties` によって注入されます。入出力は Composer と同じで、**グローバルスコープ**で動作します。詳細については、[Composer#rt](composition#rt-message) を参照してください。

[Legacy API モード](general#mode) では、入出力は VueI18n インスタンスと同じです。詳細については、[VueI18n#rt](legacy#rt-message) を参照してください。

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)
- [Composition API](../../guide/advanced/composition)

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 解決対象のロケールメッセージ。`$tm` によって返されたロケールメッセージを指定する必要があります。 |

#### 戻り値

翻訳メッセージ

### $rt(message, plural, options)

複数形のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslationOptions): string;
```

**詳細**

オーバーロードされた `$rt`。詳細については、[$rt](injection#rt-message) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 解決対象のロケールメッセージ。`$tm` によって返されたロケールメッセージを指定する必要があります。 |
| plural | number | 取得する複数形の文字列。`1` は最初のものを返します。 |
| options | TranslateOptions | 追加の [TranslateOptions](general#translateoptions) |

#### 戻り値

翻訳メッセージ

### $rt(message, list, options)

リスト補間のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslationOptions): string;
```

**詳細**

オーバーロードされた `$rt`。詳細については、[$rt](injection#rt-message) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 解決対象のロケールメッセージ。`$tm` によって返されたロケールメッセージを指定する必要があります。 |
| list | unknown[] | リスト補間の値 |
| options | TranslateOptions | 追加の [TranslateOptions](general#translateoptions) |

#### 戻り値

翻訳メッセージ

### $rt(message, named, options)

名前付き補間のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
$rt(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslationOptions): string;
```

**詳細**

オーバーロードされた `$rt`。詳細については、[$rt](injection#rt-message) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; \| VueMessageType | 解決対象のロケールメッセージ。`$tm` によって返されたロケールメッセージを指定する必要があります。 |
| named | NamedValue | 名前付き補間の値 |
| options | TranslateOptions | 追加の [TranslateOptions](general#translateoptions) |

#### 戻り値

翻訳メッセージ

### $te(key, locale)

翻訳メッセージの存在確認

**シグネチャ:**
```typescript
$te(key: Key, locale?: Locale): boolean;
```

**詳細**

詳細については、[VueI18n#te](legacy#te-key-locale) を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |
| locale | Locale | オプション。ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |

#### 戻り値

ロケールメッセージが見つかった場合は `true`、それ以外は `false`。

### $tm(key)

ロケールメッセージの取得

**シグネチャ:**
```typescript
$tm(key: Key): LocaleMessageValue<VueMessageType> | {}
```

**詳細**

[i18n コンポーネントオプション](injection#i18n) が指定されている場合、グローバルスコープのロケールメッセージよりもローカルスコープのロケールメッセージが優先的に取得されます。

[i18n コンポーネントオプション](injection#i18n) が指定されていない場合、グローバルスコープのロケールメッセージで取得されます。

現在の `locale` に基づいて、Composer インスタンスのメッセージからロケールメッセージが返されます。

`locale` を変更すると、返されるロケールメッセージもそのロケールに対応したものになります。

Composer インスタンスのメッセージに指定された `key` のロケールメッセージがない場合、[フォールバック](../../guide/essentials/fallback) を使用して返されます。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key | ターゲットとなるロケールメッセージのキー |

#### 戻り値

ロケールメッセージ

:::warning 注意
`$tm` によって返されたロケールメッセージには `$rt` を使用する必要があります。
:::

### $d(value)

日時フォーマット

**シグネチャ:**
```typescript
$d(value: number | Date): DateTimeFormatResult | string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[Composition API モード](general#i18nmode) では、入出力は VueI18n インスタンスと同じです。詳細については、[VueI18n#d](legacy#d-value) を参照してください。

[Composition API モード](general#i18nmode) では、`$d` は `app.config.globalProperties` によって注入されます。入出力は Composer インスタンスと同じで、**グローバルスコープ**で動作します。詳細については、[Composer#d](composition#d-value) を参照してください。

**参照**
- [日時フォーマット](../../guide/essentials/datetime)
- [スコープとロケールの変更](../../guide/essentials/scope)
- [Composition API](../../guide/advanced/composition#datetime-formatting)

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number \| Date | 値。タイムスタンプの数値または `Date` インスタンス |

#### 戻り値

フォーマットされた値

### $d(value, key)

日時フォーマット

**シグネチャ:**
```typescript
$d(value: number | Date, key: string): DateTimeFormatResult | string;
```

**詳細**

オーバーロードされた `$d`。詳細については、[$d](injection#d-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number \| Date | 値。タイムスタンプの数値または `Date` インスタンス |
| key | string | 日時フォーマットのキー |

#### 戻り値

フォーマットされた値

### $d(value, key, locale)

日時フォーマット

**シグネチャ:**
```typescript
$d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult | string;
```

**詳細**

オーバーロードされた `$d`。詳細については、[$d](injection#d-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number \| Date | 値。タイムスタンプの数値または `Date` インスタンス |
| key | string | 日時フォーマットのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |

#### 戻り値

フォーマットされた値

### $d(value, args)

日時フォーマット

**シグネチャ:**
```typescript
$d(value: number | Date, args: { [key: string]: string | boolean | number }): DateTimeFormatResult;
```

**詳細**

オーバーロードされた `$d`。詳細については、[$d](injection#d-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number \| Date | 値。タイムスタンプの数値または `Date` インスタンス |
| args | { [key: string]: string } | 引数の値 |

#### 戻り値

フォーマットされた値

### $d(value, options)

日時フォーマット

**シグネチャ:**
```typescript
$d(value: number | Date, options: DateTimeOptions): string;
```

**詳細**

オーバーロードされた `$d`。詳細については、[$d](injection#d-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number \| Date | 値。タイムスタンプの数値または `Date` インスタンス |
| options | DateTimeOptions | オプション。[DateTimeOptions](general#datetimeoptions) を参照 |

#### 戻り値

フォーマットされた値

### $n(value)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number): NumberFormatResult | string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[Legacy API モード](general#i18nmode) では、入出力は VueI18n インスタンスと同じです。詳細については、[VueI18n#n](legacy#n-value) を参照してください。

[Composition API モード](general#i18nmode) では、`$n` は `app.config.globalProperties` によって注入されます。入出力は Composer インスタンスと同じで、**グローバルスコープ**で動作します。詳細については、[Composer#n](composition#n-value) を参照してください。

**参照**
- [数値フォーマット](../../guide/essentials/number)
- [スコープとロケールの変更](../../guide/essentials/scope)
- [Composition API](../../guide/advanced/composition#number-formatting)

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |

#### 戻り値

フォーマットされた値

### $n(value, key)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, key: string): NumberFormatResult | string;
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | string | 数値フォーマットのキー |

#### 戻り値

フォーマットされた値

### $n(value, key, locale)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, key: string, locale: Locale): NumberFormatResult | string;
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | string | 数値フォーマットのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |

#### 戻り値

フォーマットされた値

### $n(value, args)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, args: { [key: string]: string | boolean | number }): NumberFormatResult;
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| args | { [key: string]: string } | 引数の値 |

#### 戻り値

フォーマットされた値

### $n(value, key, args)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, key: string, args: { [key: string]: string | boolean | number }): NumberFormatResult
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | string | 数値フォーマットのキー |
| args | { [key: string]: string } | 引数の値 |

#### 戻り値

フォーマットされた値

### $n(value, key, locale, args)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, key: string, locale: Locale, args: { [key: string]: string | boolean | number }): NumberFormatResult
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | string | 数値フォーマットのキー |
| locale | Locale | ロケール。グローバルスコープまたはローカルスコープをオーバーライドします |
| args | { [key: string]: string } | 引数の値 |

#### 戻り値

フォーマットされた値

### $n(value, options)

数値フォーマット

**シグネチャ:**
```typescript
$n(value: number, options: NumberOptions): string;
```

**詳細**

オーバーロードされた `$n`。詳細については、[$n](injection#n-value) の備考を参照してください。

#### パラメータ
| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| options | NumberOptions | オプション。[NumberOptions](general#numberoptions) を参照 |

#### 戻り値

フォーマットされた値
