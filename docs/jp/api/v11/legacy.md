# レガシー API

## Choice

**シグネチャ:**
```typescript
export type Choice = number;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## DateTimeFormatResult

**シグネチャ:**
```typescript
export type DateTimeFormatResult = string;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## LocaleMessageObject

**シグネチャ:**
```typescript
export type LocaleMessageObject<Message = string> = LocaleMessageDictionary<Message>;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## NumberFormatResult

**シグネチャ:**
```typescript
export type NumberFormatResult = string;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## PluralizationRulesMap

**シグネチャ:**
```typescript
export type PluralizationRulesMap = {
    [locale: string]: PluralizationRule;
};
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## TranslateResult

**シグネチャ:**
```typescript
export type TranslateResult = string;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

## VueI18n

VueI18n レガシーインターフェース

**シグネチャ:**
```typescript
export interface VueI18n<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends string ? [ResourceLocales] extends [never] ? Locale : ResourceLocales : OptionLocale | ResourceLocales, Composition extends Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale> = Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>>
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

このインターフェースは `VueI18n` クラス（Vue I18n v8.x で提供）のインターフェースと互換性があります。

### availableLocales

**シグネチャ:**
```typescript
readonly availableLocales: Composition['availableLocales'];
```

**詳細**

メッセージ内の利用可能なロケールのリスト（辞書順）。

### d

日時フォーマット

**シグネチャ:**
```typescript
d: VueI18nDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**詳細**

関数の詳細については、[VueI18nDateTimeFormatting](legacy#vuei18ndatetimeformatting) を参照してください。

### datetimeFormats

**シグネチャ:**
```typescript
readonly datetimeFormats: {
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    };
```

**詳細**

ローカリゼーションの日時フォーマット。

**参照**
- [日時フォーマット](../../guide/essentials/datetime)

### escapeParameterHtml

**シグネチャ:**
```typescript
escapeParameterHtml: Composition['escapeParameter'];
```

**詳細**

メッセージが翻訳される前に補間パラメータがエスケープされるかどうか。

**参照**
- [HTML メッセージ](../../guide/essentials/syntax#html-message)

### fallbackLocale

**シグネチャ:**
```typescript
fallbackLocale: FallbackLocales<Locales>;
```

**詳細**

この VueI18n インスタンスが使用している現在のフォールバックロケール。

**参照**
- [フォールバック](../../guide/essentials/fallback)

### formatFallbackMessages

**シグネチャ:**
```typescript
formatFallbackMessages: Composition['fallbackFormat'];
```

**詳細**

`fallbackLocale` またはルートへのフォールバック時に警告を抑制するかどうか。

**参照**
- [フォールバック](../../guide/essentials/fallback)

### getDateTimeFormat

日時フォーマットの取得

**シグネチャ:**
```typescript
getDateTimeFormat: Composition['getDateTimeFormat'];
```

**詳細**

VueI18n インスタンス [datetimeFormats](legacy#datetimeformats) から日時フォーマットを取得します。

### getLocaleMessage

ロケールメッセージの取得

**シグネチャ:**
```typescript
getLocaleMessage: Composition['getLocaleMessage'];
```

**詳細**

VueI18n インスタンス [messages](legacy#messages) からロケールメッセージを取得します。

### getNumberFormat

数値フォーマットの取得

**シグネチャ:**
```typescript
getNumberFormat: Composition['getNumberFormat'];
```

**詳細**

VueI18n インスタンス [numberFormats](legacy#numberFormats) から数値フォーマットを取得します。

### id

**シグネチャ:**
```typescript
id: number;
```

**詳細**

インスタンス ID。

### locale

**シグネチャ:**
```typescript
locale: Locales;
```

**詳細**

この VueI18n インスタンスが使用している現在のロケール。

ロケールに地域と方言が含まれている場合、このロケールには暗黙的なフォールバックが含まれます。

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)

### mergeDateTimeFormat

日時フォーマットのマージ

**シグネチャ:**
```typescript
mergeDateTimeFormat: Composition['mergeDateTimeFormat'];
```

**詳細**

日時フォーマットを VueI18n インスタンス [datetimeFormats](legacy#datetimeformats) にマージします。

### mergeLocaleMessage

ロケールメッセージのマージ

**シグネチャ:**
```typescript
mergeLocaleMessage: Composition['mergeLocaleMessage'];
```

**詳細**

ロケールメッセージを VueI18n インスタンス [messages](legacy#messages) にマージします。

### mergeNumberFormat

数値フォーマットのマージ

**シグネチャ:**
```typescript
mergeNumberFormat: Composition['mergeNumberFormat'];
```

**詳細**

数値フォーマットを VueI18n インスタンス [numberFormats](legacy#numberFormats) にマージします。

### messages

**シグネチャ:**
```typescript
readonly messages: {
        [K in keyof Messages]: Messages[K];
    };
```

**詳細**

ローカリゼーションのロケールメッセージ。

**参照**
- [クイックスタート](../../guide/essentials/started)

### missing

**シグネチャ:**
```typescript
missing: MissingHandler | null;
```

**詳細**

ローカリゼーション欠落のハンドラ。

### modifiers

**シグネチャ:**
```typescript
readonly modifiers: Composition['modifiers'];
```

**詳細**

リンクされたメッセージのカスタム修飾子。

**参照**
- [カスタム修飾子](../../guide/essentials/syntax#custom-modifiers)

### n

数値フォーマット

**シグネチャ:**
```typescript
n: VueI18nNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**詳細**

関数の詳細については、[VueI18nNumberFormatting](legacy#vuei18nnumberformatting) を参照してください。

### numberFormats

**シグネチャ:**
```typescript
readonly numberFormats: {
        [K in keyof NumberFormats]: NumberFormats[K];
    };
```

**詳細**

ローカリゼーションの数値フォーマット。

**参照**
- [数値フォーマット](../../guide/essentials/number)

### pluralizationRules

単語の複数形化のためのルールセット

**シグネチャ:**
```typescript
pluralizationRules: Composition['pluralRules'];
```

**参照**
- [カスタム複数形化](../../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**シグネチャ:**
```typescript
postTranslation: PostTranslationHandler<VueMessageType> | null;
```

**詳細**

翻訳の後処理のためのハンドラ。

### rt

ロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
rt: VueI18nResolveLocaleMessageTranslation<Locales>;
```

**詳細**

関数の詳細については、[VueI18nResolveLocaleMessageTranslation](legacy#vuei18nresolvelocalemessagetranslation) を参照してください。

### setDateTimeFormat

日時フォーマットの設定

**シグネチャ:**
```typescript
setDateTimeFormat: Composition['setDateTimeFormat'];
```

**詳細**

日時フォーマットを VueI18n インスタンス [datetimeFormats](legacy#datetimeformats) に設定します。

### setLocaleMessage

ロケールメッセージの設定

**シグネチャ:**
```typescript
setLocaleMessage: Composition['setLocaleMessage'];
```

**詳細**

ロケールメッセージを VueI18n インスタンス [messages](legacy#messages) に設定します。

### setNumberFormat

数値フォーマットの設定

**シグネチャ:**
```typescript
setNumberFormat: Composition['setNumberFormat'];
```

**詳細**

数値フォーマットを VueI18n インスタンス [numberFormats](legacy#numberFormats) に設定します。

### silentFallbackWarn

**シグネチャ:**
```typescript
silentFallbackWarn: Composition['fallbackWarn'];
```

**詳細**

ローカリゼーション失敗時のフォールバック警告を抑制するかどうか。

### silentTranslationWarn

**シグネチャ:**
```typescript
silentTranslationWarn: Composition['missingWarn'];
```

**詳細**

ローカリゼーション失敗時に出力される警告を抑制するかどうか。

**参照**
- [フォールバック](../../guide/essentials/fallback)

### sync

**シグネチャ:**
```typescript
sync: Composition['inheritLocale'];
```

**詳細**

ルートレベルのロケールをコンポーネントのローカリゼーションロケールに同期するかどうか。

**参照**
- [ローカルスコープ](../../guide/essentials/scope#local-scope-2)

### t

ロケールメッセージの翻訳

**シグネチャ:**
```typescript
t: VueI18nTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**詳細**

関数の詳細については、[VueI18nTranslation](legacy#vuei18ntranslation) を参照してください。

### tm

ロケールメッセージの取得

**シグネチャ:**
```typescript
tm: Composition['tm'];
```

**詳細**

[i18n コンポーネントオプション](injection#i18n) が指定されている場合、グローバルスコープのロケールメッセージよりもローカルスコープのロケールメッセージが優先的に取得されます。

[i18n コンポーネントオプション](injection#i18n) が指定されていない場合、グローバルスコープのロケールメッセージで取得されます。

現在の `locale` に基づいて、Composer インスタンスのメッセージからロケールメッセージが返されます。

`locale` を変更すると、返されるロケールメッセージもそのロケールに対応したものになります。

Composer インスタンスのメッセージに指定された `key` のロケールメッセージがない場合、[フォールバック](../../guide/essentials/fallback) を使用して返されます。

:::warning
`tm` によって返されたロケールメッセージには `rt` を使用する必要があります。[rt](legacy#rt-message) の詳細を参照してください。
:::

**例**

テンプレート:
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

**シグネチャ:**
```typescript
warnHtmlInMessage: WarnHtmlInMessageLevel;
```

**詳細**

HTML フォーマットのロケールメッセージの使用を許可するかどうか。

`warn` または `error` を設定した場合、VueI18n インスタンスのロケールメッセージをチェックします。

`warn` を指定した場合、コンソールに警告が出力されます。

`error` を指定した場合、エラーが発生します。

**参照**
- [HTML メッセージ](../../guide/essentials/syntax#html-message)
- [`warnHtmlInMessage` オプションのデフォルト値の変更](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### te(key, locale)

翻訳ロケールメッセージの存在確認

**シグネチャ:**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**詳細**

VueI18n インスタンス [messages](legacy#messages) にロケールメッセージが存在するかどうか。

`locale` を指定した場合、その `locale` のロケールメッセージをチェックします。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Str &#124; Key | ターゲットとなるロケールメッセージのキー |
| locale | Locales | ターゲットとなるロケール |

#### 戻り値

 ロケールメッセージが見つかった場合は `true`、それ以外は `false`

## VueI18nDateTimeFormatting

VueI18n レガシーインターフェースの日時フォーマット関数

**シグネチャ:**
```typescript
export interface VueI18nDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

これは [VueI18n](legacy#vuei18n) のためのインターフェースです。

### (value: number | Date): DateTimeFormatResult;

日時フォーマット

**シグネチャ:**
```typescript
(value: number | Date): DateTimeFormatResult;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[i18n コンポーネントオプション](injection#i18n) が指定されている場合、グローバルスコープの日時フォーマットよりもローカルスコープの日時フォーマットが優先的にフォーマットされます。

[i18n コンポーネントオプション](injection#i18n) が指定されていない場合、グローバルスコープの日時フォーマットでフォーマットされます。

**参照**
- [日時フォーマット](../../guide/essentials/datetime)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number &#124; Date | 値。タイムスタンプの数値または `Date` インスタンス |

#### 戻り値

 フォーマットされた値

### (value: Value, key: Key | ResourceKeys): DateTimeFormatResult;

日時フォーマット

**シグネチャ:**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys): DateTimeFormatResult;
```

**詳細**

オーバーロードされた `d`。詳細については、[コールシグネチャ](legacy#value-number-date-datetimeformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | Value | 値。タイムスタンプの数値または `Date` インスタンス |
| key | Key &#124; ResourceKeys | 日時フォーマットのキー |

#### 戻り値

 フォーマットされた値

### (value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;

日時フォーマット

**シグネチャ:**
```typescript
<Value extends number | Date = number, Key extends string = string>(value: Value, key: Key | ResourceKeys, locale: Locales): DateTimeFormatResult;
```

**詳細**

オーバーロードされた `d`。詳細については、[コールシグネチャ](legacy#value-number-date-datetimeformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | Value | 値。タイムスタンプの数値または `Date` インスタンス |
| key | Key &#124; ResourceKeys | 日時フォーマットのキー |
| locale | Locales | ロケール。グローバルスコープまたはローカルスコープよりも優先されます。 |

#### 戻り値

 フォーマットされた値

### (value: number | Date, args: {        [key: string]: string | boolean | number;    }): DateTimeFormatResult;

日時フォーマット

**シグネチャ:**
```typescript
(value: number | Date, args: {
        [key: string]: string | boolean | number;
    }): DateTimeFormatResult;
```

**詳細**

オーバーロードされた `d`。詳細については、[コールシグネチャ](legacy#value-number-date-datetimeformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number &#124; Date | 値。タイムスタンプの数値または `Date` インスタンス |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | 引数の値 |

#### 戻り値

 フォーマットされた値

## VueI18nNumberFormatting

VueI18n レガシーインターフェースの数値フォーマット関数

**シグネチャ:**
```typescript
export interface VueI18nNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

これは [VueI18n](legacy#vuei18n) のためのインターフェースです。

### (value: number): NumberFormatResult;

数値フォーマット

**シグネチャ:**
```typescript
(value: number): NumberFormatResult;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[i18n コンポーネントオプション](injection#i18n) が指定されている場合、グローバルスコープの数値フォーマットよりもローカルスコープの数値フォーマットが優先的にフォーマットされます。

[i18n コンポーネントオプション](injection#i18n) が指定されていない場合、グローバルスコープの数値フォーマットでフォーマットされます。

**参照**
- [数値フォーマット](../../guide/essentials/number)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |

#### 戻り値

 フォーマットされた値

### (value: number, key: Key | ResourceKeys): NumberFormatResult;

数値フォーマット

**シグネチャ:**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys): NumberFormatResult;
```

**詳細**

オーバーロードされた `n`。詳細については、[コールシグネチャ](legacy#value-number-numberformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | Key &#124; ResourceKeys | 数値フォーマットのキー |

#### 戻り値

 フォーマットされた値

### (value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;

数値フォーマット

**シグネチャ:**
```typescript
<Key extends string = string>(value: number, key: Key | ResourceKeys, locale: Locales): NumberFormatResult;
```

**詳細**

オーバーロードされた `n`。詳細については、[コールシグネチャ](legacy#value-number-numberformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| key | Key &#124; ResourceKeys | 数値フォーマットのキー |
| locale | Locales | ロケール。グローバルスコープまたはローカルスコープよりも優先されます。 |

#### 戻り値

 フォーマットされた値

### (value: number, args: {        [key: string]: string | boolean | number;    }): NumberFormatResult;

数値フォーマット

**シグネチャ:**
```typescript
(value: number, args: {
        [key: string]: string | boolean | number;
    }): NumberFormatResult;
```

**詳細**

オーバーロードされた `n`。詳細については、[コールシグネチャ](legacy#value-number-numberformatresult) の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| args | {         [key: string]: string &#124; boolean &#124; number;     } | 引数の値 |

#### 戻り値

 フォーマットされた値

## VueI18nOptions

VueI18n オプション

**シグネチャ:**
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

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

このオプションは `VueI18n` クラスコンストラクタオプション（Vue I18n v8.x で提供）と互換性があります。

### availableLocales

**シグネチャ:**
```typescript
availableLocales?: Locale[];
```

**詳細**

メッセージ内の利用可能なロケールのリスト（辞書順）。

**デフォルト値**

`[]`

### datetime

### datetimeFormats

### escapeParameterHtml

**シグネチャ:**
```typescript
escapeParameterHtml?: Options['escapeParameter'];
```

**詳細**

リストまたは名前付き補間値のパラメータをエスケープするかどうか。有効にすると、このオプションは以下を行います：
- 補間パラメータ内の HTML 特殊文字（`<`、`>`、`"`、`'`、`&`、`/`、`=`）をエスケープします。
- 以下の方法で XSS 攻撃を防ぐために、最終的な翻訳済み HTML をサニタイズします：
  - HTML 属性値内の危険な文字をエスケープする
  - イベントハンドラ属性（onclick、onerror など）を無効にする
  - href、src、action、formaction、および style 属性内の javascript: URL を無効にする

これは、翻訳出力が `v-html` で使用され、翻訳リソースに HTML マークアップ（例：ユーザー提供値の周りの `<span>`）が含まれている場合に便利です。

この使用パターンは、主に事前に計算されたテキスト文字列を UI コンポーネントに渡す場合に発生します。

エスケーププロセスでは、次の記号がそれぞれの HTML 文字エンティティに置き換えられます：`<`、`>`、`"`、`'`。

`escapeParameterHtml` を true に設定しても既存の機能が壊れることはありませんが、微妙なタイプの XSS 攻撃ベクトルに対する保護を提供します。

**デフォルト値**

`false`

**参照**
- [HTML メッセージ - escapeParameter オプションの使用](../../guide/essentials/syntax#using-the-escapeparameter-option)

### fallbackLocale

**シグネチャ:**
```typescript
fallbackLocale?: Options['fallbackLocale'];
```

**詳細**

フォールバックローカリゼーションのロケール。

より複雑なフォールバック定義については、フォールバックを参照してください。

**デフォルト値**

指定されていない場合はデフォルトの `'en-US'`、または `locale` 値

**参照**
- [フォールバック](../../guide/essentials/fallback)

### fallbackRoot

**シグネチャ:**
```typescript
fallbackRoot?: Options['fallbackRoot'];
```

**詳細**

コンポーネントローカリゼーションにおいて、ローカリゼーションが失敗した場合にルートレベル（グローバルスコープ）のローカリゼーションにフォールバックするかどうか。

`false` の場合、ルートにフォールバックしません。

**デフォルト値**

`true`

**参照**
- [フォールバック](../../guide/essentials/fallback)

### flatJson

**シグネチャ:**
```typescript
flatJson?: Options['flatJson'];
```

**詳細**

フラットな json メッセージの使用を許可するかどうか。

**デフォルト値**

`false`

### formatFallbackMessages

**シグネチャ:**
```typescript
formatFallbackMessages?: Options['fallbackFormat'];
```

**詳細**

`fallbackLocale` またはルートへのフォールバック時に警告を抑制するかどうか。

**デフォルト値**

`false`

**参照**
- [フォールバック](../../guide/essentials/fallback)

### locale

**シグネチャ:**
```typescript
locale?: Options['locale'];
```

**詳細**

ローカリゼーションのロケール。

ロケールに地域と方言が含まれている場合、このロケールには暗黙的なフォールバックが含まれます。

**デフォルト値**

`'en-US'`

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)

### message

### messageResolver

**シグネチャ:**
```typescript
messageResolver?: MessageResolver;
```

**詳細**

[`messages`](legacy#messages) を解決するためのメッセージリゾルバ。

指定されていない場合、vue-i18n 内部メッセージリゾルバがデフォルトで使用されます。

次の要件をサポートするメッセージリゾルバを自分で実装する必要があります：

- メッセージリゾルバの最初の引数として渡された [`locale`](legacy#locale) のロケールメッセージと、2 番目の引数として渡されたパスを使用してメッセージを解決します。

- メッセージが解決できなかった場合は、`null` を返す必要があります。

- `null` を返した場合、[`fallbackLocale`](legacy#fallbacklocale-2) が有効であればフォールバック時にもメッセージリゾルバが呼び出されるため、メッセージも解決する必要があります。

メッセージリゾルバは、次の API によって間接的に呼び出されます：

- [`t`](legacy#t-key)

- [`te`](legacy#te-key-locale)

- [`tm`](legacy#tm-key)

- [Translation コンポーネント](component#translation)

:::tip
:new: v9.2+
:::

:::warning
メッセージリゾルバを使用する場合、[`flatJson`](legacy#flatjson) 設定は無視されます。つまり、フラット JSON を自分で解決する必要があります。
:::

**デフォルト値**

`undefined`

**参照**
- [フォールバック](../../guide/essentials/fallback)

**例**

`createI18n` を使用して設定する方法の例を次に示します：
```js
import { createI18n } from 'vue-i18n'

// あなたのメッセージリゾルバ
function messageResolver(obj, path) {
  // シンプルなメッセージ解決！
  const msg = obj[path]
  return msg != null ? msg : null
}

// I18n オプションで呼び出す
const i18n = createI18n({
  locale: 'ja',
  messageResolver, // あなたのメッセージリゾルバを設定
  messages: {
    en: { ... },
    ja: { ... }
  }
})

// 以下、あなたの処理 ...
// ...
```




### messages

### missing

**シグネチャ:**
```typescript
missing?: Options['missing'];
```

**詳細**

ローカリゼーション欠落のハンドラ。

ハンドラは、ローカリゼーションターゲットロケール、ローカリゼーションパスキー、Vue インスタンス、および値とともに呼び出されます。

欠落ハンドラが割り当てられ、ローカリゼーションの欠落が発生した場合、警告は表示されません。

**デフォルト値**

`null`

### modifiers

**シグネチャ:**
```typescript
modifiers?: Options['modifiers'];
```

**詳細**

リンクされたメッセージのカスタム修飾子。

**参照**
- [カスタム修飾子](../../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralizationRules

**シグネチャ:**
```typescript
pluralizationRules?: Options['pluralRules'];
```

**詳細**

単語の複数形化のためのルールセット

**デフォルト値**

`{}`

**参照**
- [カスタム複数形化](../../guide/essentials/pluralization#custom-pluralization)

### postTranslation

**シグネチャ:**
```typescript
postTranslation?: Options['postTranslation'];
```

**詳細**

翻訳の後処理のためのハンドラ。ハンドラは `$t` および `t` で呼び出された後に取得されます。

このハンドラは、スペースのトリミングなど、翻訳されたテキストをフィルタリングする場合に便利です。

**デフォルト値**

`null`

### sharedMessages

**シグネチャ:**
```typescript
sharedMessages?: LocaleMessages<VueMessageType>;
```

**詳細**

コンポーネントのローカリゼーションのための共有ロケールメッセージ。詳細については、コンポーネントベースのローカリゼーションを参照してください。

**デフォルト値**

`undefined`

**参照**
- [コンポーネントの共有ロケールメッセージ](../../guide/essentials/local#shared-locale-messages-for-components)

### silentFallbackWarn

**シグネチャ:**
```typescript
silentFallbackWarn?: Options['fallbackWarn'];
```

**詳細**

言語にキーの翻訳がない場合に、翻訳キーに対してテンプレート補間を行うかどうか。

`true` の場合、「ベース」言語のテンプレートの書き込みをスキップします。キーがテンプレートになります。

**デフォルト値**

`false`

**参照**
- [フォールバック](../../guide/essentials/fallback)

### silentTranslationWarn

**シグネチャ:**
```typescript
silentTranslationWarn?: Options['missingWarn'];
```

**詳細**

ローカリゼーション失敗時に出力される警告を抑制するかどうか。

`true` の場合、ローカリゼーション失敗の警告を抑制します。

正規表現を使用する場合、翻訳キー（例：`t`）と一致するローカリゼーション失敗の警告を抑制できます。

**デフォルト値**

`false`

**参照**
- [フォールバック](../../guide/essentials/fallback)

### sync

**シグネチャ:**
```typescript
sync?: boolean;
```

**詳細**

ルートレベルのロケールをコンポーネントのローカリゼーションロケールに同期するかどうか。

`false` の場合、ルートレベルのロケールに関係なく、各コンポーネントロケールに対してローカライズします。

**デフォルト値**

`true`

**参照**
- [ローカルスコープ](../../guide/essentials/scope#local-scope-2)

### warnHtmlInMessage

**シグネチャ:**
```typescript
warnHtmlInMessage?: WarnHtmlInMessageLevel;
```

**詳細**

HTML フォーマットのロケールメッセージの使用を許可するかどうか。

warnHtmlInMessage プロパティを参照してください。

**デフォルト値**

`'off'`

**参照**
- [HTML メッセージ](../../guide/essentials/syntax#html-message)
- [`warnHtmlInMessage` オプションのデフォルト値の変更](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

## VueI18nResolveLocaleMessageTranslation

VueI18n レガシーインターフェースのロケールメッセージ翻訳解決関数

**シグネチャ:**
```typescript
export type VueI18nResolveLocaleMessageTranslation<Locales = 'en-US'> = ComposerResolveLocaleMessageTranslation<Locales>;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

これは [VueI18n](legacy#vuei18n) のためのインターフェースです。このインターフェースは [ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation) のエイリアスです。

## VueI18nTranslation

VueI18n レガシーインターフェースのロケールメッセージ翻訳関数

**シグネチャ:**
```typescript
export interface VueI18nTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? PickupPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? PickupKeys<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

これは [VueI18n](legacy#vuei18n) のためのインターフェースです。

### (key: Key | ResourceKeys): TranslateResult;

ロケールメッセージの翻訳。

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys): TranslateResult;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

[i18n コンポーネントオプション](injection#i18n) が指定されている場合、グローバルスコープのロケールメッセージよりもローカルスコープのロケールメッセージが優先的に翻訳されます。

[i18n コンポーネントオプション](injection#i18n) が指定されていない場合、グローバルスコープのロケールメッセージで翻訳されます。

**参照**
- [スコープとロケールの変更](../../guide/essentials/scope)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, named: Record&lt;string, unknown&gt;): TranslateResult;

ロケールメッセージの翻訳。

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: Record<string, unknown>): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

**参照**
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| named | Record&lt;string, unknown&gt; | 名前付き補間の値 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;

名前付き補間と複数形のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, plural: number): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、各プレースホルダー x に対して、ロケールメッセージに `{x}` トークンが含まれている必要があり、複数形化された翻訳メッセージを返します。

**参照**
- [複数形化](../../guide/essentials/pluralization)
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| plural | number | 取得する複数形の文字列。1 は最初のものを返します。 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;

名前付き補間と複数形のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, defaultMsg: string): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、各プレースホルダー x に対して、ロケールメッセージに `{x}` トークンが含まれている必要があり、翻訳が見つからなかった場合はデフォルトメッセージを返します。

**参照**
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

名前付き補間のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, named: NamedValue, options: TranslateOptions<Locales>): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、各プレースホルダー x に対して、ロケールメッセージに `{x}` トークンが含まれている必要があります。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

オプションの詳細については、 を参照してください。

**参照**
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| named | NamedValue | 名前付き補間の値 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳のための追加 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, plural: number): TranslateResult;

複数形のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、複数形化された翻訳メッセージを返します。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

**参照**
- [複数形化](../../guide/essentials/pluralization)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| plural | number | 取得する複数形の文字列。1 は最初のものを返します。 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, plural: number, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

複数形のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, plural: number, options: TranslateOptions<Locales>): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、複数形化された翻訳メッセージを返します。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

オプションの詳細については、 を参照してください。

**参照**
- [複数形化](../../guide/essentials/pluralization)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| plural | number | 取得する複数形の文字列。1 は最初のものを返します。 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳のための追加 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, defaultMsg: string): TranslateResult;

欠落しているデフォルトメッセージのためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、翻訳が見つからなかった場合、デフォルトメッセージを返します。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): TranslateResult;

欠落しているデフォルトメッセージのためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, defaultMsg: string, options: TranslateOptions<Locales>): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、翻訳が見つからなかった場合、デフォルトメッセージを返します。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

オプションの詳細については、 を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |
| options | TranslateOptions&lt;Locales&gt; | 翻訳のための追加 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, list: unknown[]): TranslateResult;

ロケールメッセージの翻訳。

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[]): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

**参照**
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;

リスト補間と複数形のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], plural: number): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、ロケールメッセージはリスト内の各プレースホルダーに対して `{0}`、`{1}`、… を含む必要があり、複数形化された翻訳メッセージを返します。

**参照**
- [複数形化](../../guide/essentials/pluralization)
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| plural | number | 取得する複数形の文字列。1 は最初のものを返します。 |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;

リスト補間と欠落しているデフォルトメッセージのためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], defaultMsg: string): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、ロケールメッセージはリスト内の各プレースホルダーに対して `{0}`、`{1}`、… を含む必要があり、翻訳が見つからなかった場合はデフォルトメッセージを返します。

**参照**
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

 翻訳メッセージ

### (key: Key | ResourceKeys, list: unknown[], options: TranslateOptions&lt;Locales&gt;): TranslateResult;

リスト補間のためのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys, list: unknown[], options: TranslateOptions<Locales>): TranslateResult;
```

**詳細**

オーバーロードされた `t`。詳細については、[コールシグネチャ](legacy#key-key-resourcekeys-translateresult) の詳細を参照してください。

このオーバーロードされた `t` では、ロケールメッセージはリスト内の各プレースホルダーに対して `{0}`、`{1}`、… を含む必要があります。

オプションに従って、翻訳が欠落している場合の警告を抑制することもできます。

オプションの詳細については、 を参照してください。

**参照**
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットとなるロケールメッセージのキー |
| list | unknown[] | リスト補間の値 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳のための追加 |

#### 戻り値

 翻訳メッセージ

## WarnHtmlInMessageLevel

**シグネチャ:**
```typescript
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error';
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::
