# Composition API

## Composer

Composer インターフェース

**シグネチャ:**
```typescript
export interface Composer<Messages extends Record<string, any> = {}, DateTimeFormats extends Record<string, any> = {}, NumberFormats extends Record<string, any> = {}, OptionLocale = Locale, ResourceLocales = PickupLocales<NonNullable<Messages>> | PickupLocales<NonNullable<DateTimeFormats>> | PickupLocales<NonNullable<NumberFormats>>, Locales = Locale extends GeneratedLocale ? GeneratedLocale : OptionLocale extends Locale ? IsNever<ResourceLocales> extends true ? Locale : ResourceLocales : OptionLocale | ResourceLocales> extends ComposerCustom
```

**詳細**

これは Vue 3 Composition API で使用されるインターフェースです。

### availableLocales

**シグネチャ:**
```typescript
readonly availableLocales: ComputedRef<Locales[]>;
```

**詳細**

`messages` 内の利用可能なロケールのリスト（辞書順）。

### d

日時フォーマット

**シグネチャ:**
```typescript
d: ComposerDateTimeFormatting<DateTimeFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }>>;
```

**詳細**

関数の詳細については、[ComposerDateTimeFormatting](composition#composerdatetimeformatting) を参照してください

### datetimeFormats

**シグネチャ:**
```typescript
readonly datetimeFormats: ComputedRef<{
        [K in keyof DateTimeFormats]: DateTimeFormats[K];
    }>;
```

**詳細**

ローカリゼーションの日時フォーマット。

参照:
- [日時フォーマット](../../guide/essentials/datetime)

### escapeParameter

**シグネチャ:**
```typescript
escapeParameter: boolean;
```

**詳細**

メッセージが翻訳される前に補間パラメータをエスケープするかどうか。

参照:
- [HTML メッセージ](../../guide/essentials/syntax#html-message)

### fallbackFormat

**シグネチャ:**
```typescript
fallbackFormat: boolean;
```

**詳細**

`fallbackLocale` またはルートにフォールバックするときに警告を抑制するかどうか。

参照:
- [フォールバック](../../guide/essentials/fallback)

### fallbackLocale

**シグネチャ:**
```typescript
fallbackLocale: WritableComputedRef<FallbackLocales<Locales>>;
```

**詳細**

この Composer インスタンスが使用している現在のフォールバックロケール。

参照:
- [フォールバック](../../guide/essentials/fallback)

### fallbackRoot

**シグネチャ:**
```typescript
fallbackRoot: boolean;
```

**詳細**

ローカリゼーションに失敗したときにルートレベル（グローバルスコープ）のローカリゼーションにフォールバックするかどうか。

参照:
- [フォールバック](../../guide/essentials/fallback)

### fallbackWarn

**シグネチャ:**
```typescript
fallbackWarn: boolean | RegExp;
```

**詳細**

ローカリゼーションに失敗したときにフォールバック警告を抑制するかどうか。

参照:
- [フォールバック](../../guide/essentials/fallback)

### id

**シグネチャ:**
```typescript
id: number;
```

**詳細**

インスタンス ID。

### inheritLocale

**シグネチャ:**
```typescript
inheritLocale: boolean;
```

**詳細**

ルートレベルのロケールをコンポーネントのローカリゼーションロケールに継承するかどうか。

参照:
 - [ローカルスコープ](../../guide/essentials/scope#local-scope-2)

### isGlobal

**シグネチャ:**
```typescript
readonly isGlobal: boolean;
```

**詳細**

この composer インスタンスがグローバルかどうか

### locale

**シグネチャ:**
```typescript
locale: WritableComputedRef<Locales>;
```

**詳細**

この Composer インスタンスが使用している現在のロケール。

ロケールに地域と方言が含まれている場合、このロケールには暗黙的なフォールバックが含まれます。

参照:
- [スコープとロケールの変更](../../guide/essentials/scope)

### messages

**シグネチャ:**
```typescript
readonly messages: ComputedRef<{
        [K in keyof Messages]: Messages[K];
    }>;
```

**詳細**

ローカリゼーションのロケールメッセージ。

参照:
- [クイックスタート](../../guide/essentials/started)

### missingWarn

**シグネチャ:**
```typescript
missingWarn: boolean | RegExp;
```

**詳細**

ローカリゼーションに失敗したときに出力される警告を抑制するかどうか。

参照:
- [フォールバック](../../guide/essentials/fallback)

### modifiers

**シグネチャ:**
```typescript
readonly modifiers: LinkedModifiers<VueMessageType>;
```

**詳細**

リンクメッセージのカスタム修飾子。

参照:
 - [カスタム修飾子](../../guide/essentials/syntax#custom-modifiers)

### n

数値フォーマット

**シグネチャ:**
```typescript
n: ComposerNumberFormatting<NumberFormats, Locales, RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }>>;
```

**詳細**

関数の詳細については、[ComposerNumberFormatting](composition#composernumberformatting) を参照してください

### numberFormats

**シグネチャ:**
```typescript
readonly numberFormats: ComputedRef<{
        [K in keyof NumberFormats]: NumberFormats[K];
    }>;
```

**詳細**

ローカリゼーションの数値フォーマット。

参照:
- [数値フォーマット](../../guide/essentials/number)

### pluralRules

**シグネチャ:**
```typescript
readonly pluralRules: PluralizationRules;
```

**詳細**

単語の複数形化のルールセット

参照:
- [カスタム複数形化](../../guide/essentials/pluralization#custom-pluralization)

### rt

ロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
rt: ComposerResolveLocaleMessageTranslation<Locales>;
```

**詳細**

関数の詳細については、[ComposerResolveLocaleMessageTranslation](composition#composerresolvelocalemessagetranslation) を参照してください

### t

ロケールメッセージ翻訳

**シグネチャ:**
```typescript
t: ComposerTranslation<Messages, Locales, RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>>;
```

**詳細**

関数の詳細については、[ComposerTranslation](composition#composertranslation) を参照してください

### warnHtmlMessage

**シグネチャ:**
```typescript
warnHtmlMessage: boolean;
```

**詳細**

HTML フォーマットのロケールメッセージの使用を許可するかどうか。

`false` に設定すると、Composer インスタンスのロケールメッセージを確認します。

`true` を指定すると、コンソールに警告が出力されます。

参照:
- [HTML メッセージ](../../guide/essentials/syntax#html-message)
- [`warnHtmlInMessage` オプションのデフォルト値の変更](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

### getDateTimeFormat(locale)

日時フォーマットの取得

**シグネチャ:**
```typescript
getDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Return = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema>(locale: LocaleSchema | Locale): Return;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| DateTimeSchema | 日時フォーマットスキーマ、デフォルトは `never` |

**詳細**

Composer インスタンスから日時フォーマットを取得します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |

#### 戻り値

日時フォーマット

### getLocaleMessage(locale)

ロケールメッセージの取得

**シグネチャ:**
```typescript
getLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Return = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema>(locale: LocaleSchema | Locale): Return;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| MessageSchema | ロケールメッセージスキーマ、デフォルトは `never` |

**詳細**

Composer インスタンスからロケールメッセージを取得します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |

#### 戻り値

ロケールメッセージ

### getMissingHandler()

欠落ハンドラーの取得

**シグネチャ:**
```typescript
getMissingHandler(): MissingHandler | null;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |

#### 戻り値

[MissingHandler](composition#missinghandler)

### getNumberFormat(locale)

数値フォーマットの取得

**シグネチャ:**
```typescript
getNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Return = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema>(locale: LocaleSchema | Locale): Return;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| NumberSchema | 数値フォーマットスキーマ、デフォルトは `never` |

**詳細**

Composer インスタンスから数値フォーマットを取得します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |

#### 戻り値

数値フォーマット

### getPostTranslationHandler()

翻訳後ハンドラーの取得

**シグネチャ:**
```typescript
getPostTranslationHandler(): PostTranslationHandler<VueMessageType> | null;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |

#### 戻り値



### mergeDateTimeFormat(locale, format)

日時フォーマットの統合

**シグネチャ:**
```typescript
mergeDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, Formats = IsNever<DateTimeSchema> extends true ? Record<string, any> : DateTimeSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| DateTimeSchema | 日時フォーマットスキーマ、デフォルトは `never` |

**詳細**

日時フォーマットを Composer インスタンスに統合します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| format | Formats | ターゲット日時フォーマット |

### mergeLocaleMessage(locale, message)

ロケールメッセージの統合

**シグネチャ:**
```typescript
mergeLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Message = IsNever<MessageSchema> extends true ? Record<string, any> : MessageSchema>(locale: LocaleSchema | Locale, message: Message): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| MessageSchema | ロケールメッセージスキーマ、デフォルトは `never` |

**詳細**

ロケールメッセージを Composer インスタンスに統合します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| message | Message | メッセージ |

### mergeNumberFormat(locale, format)

数値フォーマットの統合

**シグネチャ:**
```typescript
mergeNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, Formats = IsNever<NumberSchema> extends true ? Record<string, any> : NumberSchema>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| NumberSchema | 数値フォーマットスキーマ、デフォルトは `never` |

**詳細**

数値フォーマットを Composer インスタンスに統合します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| format | Formats | ターゲット数値フォーマット |

### setDateTimeFormat(locale, format)

日時フォーマットの設定

**シグネチャ:**
```typescript
setDateTimeFormat<DateTimeSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<DateTimeFormats>> = PickupLocales<NonNullable<DateTimeFormats>>, FormatsType = IsNever<DateTimeSchema> extends true ? IsEmptyObject<DateTimeFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K];
    }> : NonNullable<DateTimeFormats>[Locale] : DateTimeSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| DateTimeSchema | 日時フォーマットスキーマ、デフォルトは `never` |

**詳細**

日時フォーマットを Composer インスタンスに設定します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| format | Formats | ターゲット日時フォーマット |

### setLocaleMessage(locale, message)

ロケールメッセージの設定

**シグネチャ:**
```typescript
setLocaleMessage<MessageSchema extends LocaleMessage<VueMessageType> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, MessageType = IsNever<MessageSchema> extends true ? IsEmptyObject<Messages> extends true ? RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }> : NonNullable<Messages>[Locale] : MessageSchema, Message extends MessageType = MessageType>(locale: LocaleSchema | Locale, message: Message): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| MessageSchema | ロケールメッセージスキーマ、デフォルトは `never` |

**詳細**

ロケールメッセージを Composer インスタンスに設定します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| message | Message | メッセージ |

### setMissingHandler(handler)

欠落ハンドラーの設定

**シグネチャ:**
```typescript
setMissingHandler(handler: MissingHandler | null): void;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| handler | MissingHandler &#124; null | [MissingHandler](composition#missinghandler) |

### setNumberFormat(locale, format)

数値フォーマットの設定

**シグネチャ:**
```typescript
setNumberFormat<NumberSchema extends Record<string, any> = never, LocaleSchema extends string = string, Locale extends PickupLocales<NonNullable<NumberFormats>> = PickupLocales<NonNullable<NumberFormats>>, FormatsType = IsNever<NumberSchema> extends true ? IsEmptyObject<NumberFormats> extends true ? RemoveIndexSignature<{
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K];
    }> : NonNullable<NumberFormats>[Locale] : NumberSchema, Formats extends FormatsType = FormatsType>(locale: LocaleSchema | Locale, format: Formats): void;
```

#### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| NumberSchema | 数値フォーマットスキーマ、デフォルトは `never` |

**詳細**

数値フォーマットを Composer インスタンスに設定します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| locale | LocaleSchema &#124; Locale | ターゲットロケール |
| format | Formats | ターゲット数値フォーマット |

### setPostTranslationHandler(handler)

翻訳後ハンドラーの設定

**シグネチャ:**
```typescript
setPostTranslationHandler(handler: PostTranslationHandler<VueMessageType> | null): void;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| handler | PostTranslationHandler&lt;VueMessageType&gt; &#124; null |  |

### te(key, locale)

翻訳ロケールメッセージが存在するか

**シグネチャ:**
```typescript
te<Str extends string, Key extends PickupKeys<Messages> = PickupKeys<Messages>>(key: Str | Key, locale?: Locales): boolean;
```

**詳細**

Composer インスタンス上にロケールメッセージが存在するかどうか。

`locale` を指定した場合、`locale` のロケールメッセージを確認します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Str &#124; Key | ターゲットロケールメッセージキー |
| locale | Locales | ロケール、グローバルスコープまたはローカルスコープよりも優先して使用されます |

#### 戻り値

ロケールメッセージが見つかった場合は `true`、それ以外の場合は `false`。キーに存在する値が翻訳可能でない場合でも `false` が返されますが、`translateExistCompatible` が `true` に設定されている場合、キーが利用可能であれば、値が翻訳可能でなくても `true` が返されます。

### tm(key)

ロケールメッセージ取得

**シグネチャ:**
```typescript
tm<Key extends string, ResourceKeys extends PickupKeys<Messages> = PickupKeys<Messages>, Locale extends PickupLocales<NonNullable<Messages>> = PickupLocales<NonNullable<Messages>>, Target = IsEmptyObject<Messages> extends false ? NonNullable<Messages>[Locale] : RemoveIndexSignature<{
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K];
    }>, Return = ResourceKeys extends ResourcePath<Target> ? ResourceValue<Target, ResourceKeys> : Record<string, any>>(key: Key | ResourceKeys): Return;
```

**詳細**

`useI18n` で [I18nScope](general#i18nscope) `'local'` またはいくつかの [UseI18nOptions](composition#usei18noptions) が指定されている場合、グローバルスコープのロケールメッセージよりも優先してローカルスコープのロケールメッセージで翻訳されます。

現在の `locale` に基づいて、Composer インスタンスのメッセージからロケールメッセージが返されます。

`locale` を変更すると、返されるロケールメッセージもそのロケールに対応します。

Composer インスタンスのメッセージに指定された `key` のロケールメッセージがない場合、[フォールバック](../../guide/essentials/fallback)で返されます。

 [!WARNING]  `tm` によって返されたロケールメッセージには `rt` を使用する必要があります。`rt` の詳細を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys | ターゲットロケールメッセージキー |

#### 戻り値

ロケールメッセージ

**例**

template ブロック:
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

script ブロック:
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

`useI18n` の Composer 追加オプション

**シグネチャ:**
```typescript
export interface ComposerAdditionalOptions
```

**詳細**

`ComposerAdditionalOptions` は [ComposerOptions](composition#composeroptions) を拡張するため、これらのオプションを指定できます。

### useScope

## ComposerCustom

Composer の型カスタム定義

**シグネチャ:**
```typescript
export interface ComposerCustom
```

**詳細**

Composer を拡張できるインターフェース。

サードパーティ（例：nuxt/i18n）によって定義された型

**例**


```ts
// vue-i18n.d.ts (アプリの `.d.ts` ファイル)

declare module 'vue-i18n' {
  interface ComposerCustom {
    localeCodes: string[]
  }
}
```




## ComposerDateTimeFormatting

日時フォーマット関数

**シグネチャ:**
```typescript
export interface ComposerDateTimeFormatting<DateTimeFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>, C = IsEmptyObject<DefinedDateTimeFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K];
}> : never, M = IsEmptyObject<DateTimeFormats> extends false ? PickupFormatKeys<DateTimeFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**詳細**

これは [Composer](composition#composer) のインターフェースです

### (value: number | Date | string): string;

日時フォーマット

**シグネチャ:**
```typescript
(value: number | Date | string): string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

`useI18n` で `'local'` またはいくつかの [UseI18nOptions](composition#usei18noptions) が指定されている場合、グローバルスコープの日時フォーマットよりも優先してローカルスコープの日時フォーマットで翻訳されます。

そうでない場合は、グローバルスコープの日時フォーマットでフォーマットされます。

参照:
- [日時フォーマット](../../guide/essentials/datetime)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number &#124; Date &#124; string | 値、タイムスタンプ数値または `Date` インスタンスまたは ISO 8601 文字列 |

#### 戻り値

フォーマットされた値

### (value: Value, keyOrOptions: OptionsType): IsPart&lt;OptionsType&gt; extends true ? Intl.DateTimeFormatPart[] : string;

日時フォーマット

**シグネチャ:**
```typescript
<Value extends number | Date | string = number, Key extends string = string, OptionsType extends Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>>(value: Value, keyOrOptions: OptionsType): IsPart<OptionsType> extends true ? Intl.DateTimeFormatPart[] : string;
```

**詳細**

オーバーロードされた `d`。

このオーバーロードされた `d` では、日時フォーマットに登録されたキーの日時フォーマットでフォーマットします。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | Value | 値、タイムスタンプ数値または `Date` インスタンスまたは ISO 8601 文字列 |
| keyOrOptions | OptionsType | 日時フォーマットのキー、または日時フォーマットの追加オプション |

#### 戻り値

フォーマットされた値

### (value: Value, keyOrOptions: OptionsType, locale: Locales): IsPart&lt;OptionsType&gt; extends true ? Intl.DateTimeFormatPart[] : string;

日時フォーマット

**シグネチャ:**
```typescript
<Value extends number | Date | string = number, Key extends string = string, OptionsType extends Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Locales>>(value: Value, keyOrOptions: OptionsType, locale: Locales): IsPart<OptionsType> extends true ? Intl.DateTimeFormatPart[] : string;
```

**詳細**

オーバーロードされた `d`。

このオーバーロードされた `d` では、ターゲットロケールの日時フォーマットに登録されたキーの日時フォーマットでフォーマットします

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | Value | 値、タイムスタンプ数値または `Date` インスタンスまたは ISO 8601 文字列 |
| keyOrOptions | OptionsType | 日時フォーマットのキー、または日時フォーマットの追加オプション |
| locale | Locales | ロケール、グローバルスコープまたはローカルスコープよりも優先して使用されます。 |

#### 戻り値

フォーマットされた値

## ComposerNumberFormatting

数値フォーマット関数

**シグネチャ:**
```typescript
export interface ComposerNumberFormatting<NumberFormats extends Record<string, any> = {}, Locales = 'en-US', DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>, C = IsEmptyObject<DefinedNumberFormat> extends false ? PickupFormatPathKeys<{
    [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K];
}> : never, M = IsEmptyObject<NumberFormats> extends false ? PickupFormatKeys<NumberFormats> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**詳細**

これは [Composer](composition#composer) のインターフェースです

### (value: number): string;

数値フォーマット

**シグネチャ:**
```typescript
(value: number): string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

`useI18n` で `'local'` またはいくつかの [UseI18nOptions](composition#usei18noptions) が指定されている場合、グローバルスコープの日時フォーマットよりも優先してローカルスコープの日時フォーマットで翻訳されます。

そうでない場合は、グローバルスコープの数値フォーマットでフォーマットされます。

参照:
- [数値フォーマット](../../guide/essentials/number)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |

#### 戻り値

フォーマットされた値

### (value: number, keyOrOptions: OptionsType): IsPart&lt;OptionsType&gt; extends true ? Intl.NumberFormatPart[] : string;

数値フォーマット

**シグネチャ:**
```typescript
<Key extends string = string, OptionsType extends Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>>(value: number, keyOrOptions: OptionsType): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string;
```

**詳細**

オーバーロードされた `n`。

このオーバーロードされた `n` では、数値フォーマットに登録されたキーの数値フォーマットでフォーマットします。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| keyOrOptions | OptionsType | 数値フォーマットのキー、または数値フォーマットの追加オプション |

#### 戻り値

フォーマットされた値

### (value: number, keyOrOptions: OptionsType, locale: Locales): IsPart&lt;OptionsType&gt; extends true ? Intl.NumberFormatPart[] : string;

数値フォーマット

**シグネチャ:**
```typescript
<Key extends string = string, OptionsType extends Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales> = Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Locales>>(value: number, keyOrOptions: OptionsType, locale: Locales): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string;
```

**詳細**

オーバーロードされた `n`。

このオーバーロードされた `n` では、ターゲットロケールの数値フォーマットに登録されたキーの数値フォーマットでフォーマットします。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| value | number | 数値 |
| keyOrOptions | OptionsType | 数値フォーマットのキー、または数値フォーマットの追加オプション |
| locale | Locales | ロケール、グローバルスコープまたはローカルスコープよりも優先して使用されます。 |

#### 戻り値

フォーマットされた値

## ComposerOptions

Composer オプション

**シグネチャ:**
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

**詳細**

これは composer を作成するためのオプションです。

### datetime

### datetimeFormats

### escapeParameter

**シグネチャ:**
```typescript
escapeParameter?: boolean;
```

**詳細**

`escapeParameter` が true に設定されている場合、メッセージが翻訳される前に補間パラメータがエスケープされます。

これは、翻訳出力が `v-html` で使用され、翻訳リソースに html マークアップが含まれている場合（例：ユーザーが提供した値を囲む場合）に便利です。

この使用パターンは、主に事前に計算されたテキスト文字列を UI コンポーネントに渡す場合に発生します。

エスケーププロセスでは、次の記号をそれぞれの HTML 文字エンティティに置き換えます：`<`、`>`、`"`、`'`。

`escapeParameter` を true に設定しても既存の機能は損なわれませんが、微妙なタイプの XSS 攻撃ベクトルに対する保護を提供します。

参照:
- [HTML メッセージ](../../guide/essentials/syntax#html-message)

 `false`

### fallbackFormat

**シグネチャ:**
```typescript
fallbackFormat?: boolean;
```

**詳細**

言語にキーの翻訳がない場合に翻訳キーでテンプレート補間を行うかどうか。

`true` の場合、「ベース」言語のテンプレートの書き込みをスキップします。キーがテンプレートになります。

参照:
- [フォールバック](../../guide/essentials/fallback)

 `false`

### fallbackLocale

**シグネチャ:**
```typescript
fallbackLocale?: FallbackLocale;
```

**詳細**

フォールバックローカリゼーションのロケール。

より複雑なフォールバック定義については、fallback を参照してください。

参照:
- [フォールバック](../../guide/essentials/fallback)

 指定されていない場合は `locale` のデフォルト `'en-US'`、または `locale` の値

### fallbackRoot

**シグネチャ:**
```typescript
fallbackRoot?: boolean;
```

**詳細**

コンポーネントのローカリゼーションにおいて、ローカリゼーションに失敗したときにルートレベル（グローバルスコープ）のローカリゼーションにフォールバックするかどうか。

`false` の場合、ルートにフォールバックしません。

参照:
- [フォールバック](../../guide/essentials/fallback)

 `true`

### fallbackWarn

**シグネチャ:**
```typescript
fallbackWarn?: boolean | RegExp;
```

**詳細**

`fallbackLocale` またはルートにフォールバックするときに警告を抑制するかどうか。

`false` の場合、フォールバック警告を抑制します。

正規表現を使用すると、翻訳キー（例：`t`）と一致するフォールバック警告を抑制できます。

参照:
- [フォールバック](../../guide/essentials/fallback)

 `true`

### flatJson

**シグネチャ:**
```typescript
flatJson?: boolean;
```

**詳細**

フラットな json メッセージの使用を許可するかどうか

 `false`

### inheritLocale

**シグネチャ:**
```typescript
inheritLocale?: boolean;
```

**詳細**

ルートレベルのロケールをコンポーネントのローカリゼーションロケールに継承するかどうか。

`false` の場合、ルートレベルのロケールに関係なく、コンポーネントロケールごとにローカライズします。

参照:
- [ローカルスコープ](../../guide/essentials/scope#local-scope-2)

 `true`

### locale

**シグネチャ:**
```typescript
locale?: Locale;
```

**詳細**

ローカリゼーションのロケール。

ロケールに地域と方言が含まれている場合、このロケールには暗黙的なフォールバックが含まれます。

参照:
- [スコープとロケールの変更](../../guide/essentials/scope)

 `'en-US'`

### message

### messageCompiler

**シグネチャ:**
```typescript
messageCompiler?: MessageCompiler;
```

**詳細**

カスタムメッセージフォーマット用のコンパイラ。

指定しない場合、vue-i18n のデフォルトメッセージコンパイラが使用されます。

メッセージ関数を返す独自のメッセージコンパイラを実装する必要があります

**例**

`intl-messageformat` を使用してメッセージコンパイラをカスタマイズする方法の例を次に示します
```js
import { createI18n } from 'vue-i18n'
import IntlMessageFormat from 'intl-messageformat'

function messageCompiler(message, { locale, key, onError }) {
  if (typeof message === 'string') {
    // キャッシュ戦略やメモ化を使用して、ここでメッセージコンパイラのパフォーマンスをさらに調整できます
    const formatter = new IntlMessageFormat(message, locale)
    return ctx => formatter.format(ctx.values)
  } else {
    // AST をサポートしたい場合、
    // バンドルプラグインを使用して `json`、`yaml` などのロケールメッセージを変換する必要があります。
    onError && onError(new Error('not support for AST'))
    return () => key // `key` でデフォルトを返す
  }
}

// I18n オプションで呼び出し
const i18n = createI18n({
  locale: 'ja',
  messageCompiler, // メッセージコンパイラを設定
  messages: {
    en: {
      hello: 'hello world!',
      greeting: 'hi, {name}!',
      // ICU メッセージフォーマット
      photo: `You have {numPhotos, plural,
        =0 {no photos.}
        =1 {one photo.}
        other {# photos.}
      }`
    },
  }
})

// 以下、あなたのやること ...
// ...
```

 [!TIP] :new: v9.3+

 [!WARNING]  カスタムメッセージフォーマットは実験的な機能です。将来、破壊的な変更が加えられたり、削除されたりする可能性があります。

参照:
- [カスタムメッセージフォーマット](../../guide/advanced/format)

 `undefined`


### messageResolver

**シグネチャ:**
```typescript
messageResolver?: MessageResolver;
```

**詳細**

 を解決するためのメッセージリゾルバー。

指定しない場合、デフォルトで vue-i18n 内部メッセージリゾルバーが使用されます。

次の要件をサポートするメッセージリゾルバーを自分で実装する必要があります：

- メッセージリゾルバーの最初の引数として渡された  のロケールメッセージと、2番目の引数として渡されたパスを使用してメッセージを解決します。

- メッセージを解決できなかった場合は、`null` を返す必要があります。

- `null` を返した場合、 が有効になっているとフォールバック時にもメッセージリゾルバーが呼び出されるため、メッセージも解決する必要があります。

メッセージリゾルバーは、次の API によって間接的に呼び出されます：

-  -  -  -

**例**

`createI18n` を使用して設定する方法の例を次に示します：
```js
import { createI18n } from 'vue-i18n'

// あなたのメッセージリゾルバー
function messageResolver(obj, path) {
  // 単純なメッセージ解決！
  const msg = obj[path]
  return msg != null ? msg : null
}

// I18n オプションで呼び出し
const i18n = createI18n({
  locale: 'ja',
  messageResolver, // メッセージリゾルバーを設定
  messages: {
    en: { ... },
    ja: { ... }
  }
})

// 以下、あなたのやること ...
// ...
```

 [!TIP]  :new: v9.2+

 [!WARNING]  メッセージリゾルバーを使用する場合、 設定は無視されます。つまり、フラット JSON を自分で解決する必要があります。

参照:
- [フォールバック](../../guide/essentials/fallback)

 `undefined`


### messages

### missing

**シグネチャ:**
```typescript
missing?: MissingHandler;
```

**詳細**

ローカリゼーション欠落のハンドラー。

ハンドラーは、ローカリゼーションターゲットロケール、ローカリゼーションパスキー、Vue インスタンス、および値で呼び出されます。

欠落ハンドラーが割り当てられ、ローカリゼーション欠落が発生した場合、警告は表示されません。

 `null`

### missingWarn

**シグネチャ:**
```typescript
missingWarn?: boolean | RegExp;
```

**詳細**

ローカリゼーションに失敗したときに出力される警告を抑制するかどうか。

`false` の場合、ローカリゼーション失敗警告を抑制します。

正規表現を使用すると、翻訳キー（例：`t`）と一致するローカリゼーション失敗警告を抑制できます。

参照:
- [フォールバック](../../guide/essentials/fallback)

 `true`

### modifiers

**シグネチャ:**
```typescript
modifiers?: LinkedModifiers<VueMessageType>;
```

**詳細**

リンクメッセージのカスタム修飾子。

参照:
- [カスタム修飾子](../../guide/essentials/syntax#custom-modifiers)

### number

### numberFormats

### pluralRules

**シグネチャ:**
```typescript
pluralRules?: PluralizationRules;
```

**詳細**

単語の複数形化のルールセット

参照:
- [カスタム複数形化](../../guide/essentials/pluralization#custom-pluralization)

 `{}`

### postTranslation

**シグネチャ:**
```typescript
postTranslation?: PostTranslationHandler<VueMessageType>;
```

**詳細**

翻訳の後処理用ハンドラー。

ハンドラーは `t` で呼び出された後に取得されます。

スペースのトリミングなど、翻訳されたテキストをフィルタリングしたい場合に便利です。

 `null`

### warnHtmlMessage

**シグネチャ:**
```typescript
warnHtmlMessage?: boolean;
```

**詳細**

HTML フォーマットのロケールメッセージの使用を許可するかどうか。

warnHtmlMessage プロパティを参照してください。

参照:
- [HTML メッセージ](../../guide/essentials/syntax#html-message)
- [`warnHtmlInMessage` オプションのデフォルト値の変更](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)

 `true`

## ComposerResolveLocaleMessageTranslation

ロケールメッセージ翻訳解決関数

**シグネチャ:**
```typescript
export interface ComposerResolveLocaleMessageTranslation<Locales = 'en-US'>
```

**詳細**

これは [Composer](composition#composer) のインターフェースです

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType): string;

ロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType): string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

`useI18n` で `'local'` またはいくつかの [UseI18nOptions](composition#usei18noptions) が指定されている場合、グローバルスコープのロケールメッセージよりも優先してローカルスコープのロケールメッセージで翻訳されます。

そうでない場合は、グローバルスコープのロケールメッセージで翻訳されます。

 [!TIP]  `rt` のユースケースは、`tm`、`v-for`、javascript `for` ステートメントを使用したプログラムによるロケールメッセージ翻訳です。

 [!WARNING]  `rt` は、ロケールメッセージのキーではなく、ロケールメッセージを直接処理するという点で `t` とは異なります。`rt` には内部フォールバックはありません。`tm` によって返されるロケールメッセージの構造を理解して使用する必要があります。

参照:
- [スコープとロケールの変更](../../guide/essentials/scope)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 解決するターゲットロケールメッセージ。`tm` によって返されるロケールメッセージを指定する必要があります。 |

#### 戻り値

翻訳されたメッセージ

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, plural: number, options?: TranslateOptions&lt;Locales&gt;): string;

複数形のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, plural: number, options?: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `rt`。

このオーバーロードされた `rt` では、複数形化された翻訳メッセージを返します。

 [!TIP]  `rt` のユースケースは、`tm`、`v-for`、javascript `for` ステートメントを使用したプログラムによるロケールメッセージ翻訳です。

 [!WARNING]  `rt` は、ロケールメッセージのキーではなく、ロケールメッセージを直接処理するという点で `t` とは異なります。`rt` には内部フォールバックはありません。`tm` によって返されるロケールメッセージの構造を理解して使用する必要があります。

参照:
- [複数形化](../../guide/essentials/pluralization)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 解決するターゲットロケールメッセージ。`tm` によって返されるロケールメッセージを指定する必要があります。 |
| plural | number | 取得する複数形文字列。1 は最初のものを返します。 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, list: unknown[], options?: TranslateOptions&lt;Locales&gt;): string;

リスト補間のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, list: unknown[], options?: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `rt`。

このオーバーロードされた `rt` では、複数形化された翻訳メッセージを返します。

 [!TIP]  `rt` のユースケースは、`tm`、`v-for`、javascript `for` ステートメントを使用したプログラムによるロケールメッセージ翻訳です。

 [!WARNING]  `rt` は、ロケールメッセージのキーではなく、ロケールメッセージを直接処理するという点で `t` とは異なります。`rt` には内部フォールバックはありません。`tm` によって返されるロケールメッセージの構造を理解して使用する必要があります。

参照:
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 解決するターゲットロケールメッセージ。`tm` によって返されるロケールメッセージを指定する必要があります。 |
| list | unknown[] | リスト補間の値。 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

### (message: MessageFunction&lt;VueMessageType&gt; | VueMessageType, named: NamedValue, options?: TranslateOptions&lt;Locales&gt;): string;

名前付き補間のロケールメッセージ翻訳の解決

**シグネチャ:**
```typescript
(message: MessageFunction<VueMessageType> | VueMessageType, named: NamedValue, options?: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `rt`。

このオーバーロードされた `rt` では、プレースホルダー x ごとに、ロケールメッセージに `{x}` トークンが含まれている必要があります。

 [!TIP]  `rt` のユースケースは、`tm`、`v-for`、javascript `for` ステートメントを使用したプログラムによるロケールメッセージ翻訳です。

 [!WARNING]  `rt` は、ロケールメッセージのキーではなく、ロケールメッセージを直接処理するという点で `t` とは異なります。`rt` には内部フォールバックはありません。`tm` によって返されるロケールメッセージの構造を理解して使用する必要があります。

参照:
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| message | MessageFunction&lt;VueMessageType&gt; &#124; VueMessageType | 解決するターゲットロケールメッセージ。`tm` によって返されるロケールメッセージを指定する必要があります。 |
| named | NamedValue | 名前付き補間の値。 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

## ComposerTranslation

ロケールメッセージ翻訳関数

**シグネチャ:**
```typescript
export interface ComposerTranslation<Messages extends Record<string, any> = {}, Locales = 'en-US', DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>, C = IsEmptyObject<DefinedLocaleMessage> extends false ? JsonPaths<{
    [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K];
}> : never, M = IsEmptyObject<Messages> extends false ? TranslationsPaths<Messages> : never, ResourceKeys extends C | M = IsNever<C> extends false ? IsNever<M> extends false ? C | M : C : IsNever<M> extends false ? M : never>
```

**詳細**

これは [Composer](composition#composer) のインターフェースです

### (key: Key | ResourceKeys | number): string;

ロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number): string;
```

**詳細**

リアクティブなコンテキストで使用される場合、ロケールが変更されると再評価されます。

`useI18n` で [I18nScope](general#i18nscope) `'local'` またはいくつかの [UseI18nOptions](composition#usei18noptions) が指定されている場合、グローバルスコープのロケールメッセージよりも優先してローカルスコープのロケールメッセージで翻訳されます。

そうでない場合は、グローバルスコープのロケールメッセージで翻訳されます。

参照:
- [スコープとロケールの変更](../../guide/essentials/scope)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, named: NamedValue): string;

名前付き補間のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、プレースホルダー x ごとに、ロケールメッセージに `{x}` トークンが含まれている必要があります。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

参照:
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| named | NamedValue | 名前付き補間の値 |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;

名前付き補間と複数形のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, plural: number): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、プレースホルダー x ごとに、ロケールメッセージに `{x}` トークンが含まれ、複数形化された翻訳メッセージを返します。

参照:
- [複数形化](../../guide/essentials/pluralization)
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| named | NamedValue | 名前付き補間の値 |
| plural | number | 取得する複数形文字列。1 は最初のものを返します。 |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;

名前付き補間と複数形のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, defaultMsg: string): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、プレースホルダー x ごとに、ロケールメッセージに `{x}` トークンが含まれ、翻訳が見つからなかった場合はデフォルトメッセージを返します。

参照:
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| named | NamedValue | 名前付き補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions&lt;Locales&gt;): string;

名前付き補間のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, named: NamedValue, options: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、プレースホルダー x ごとに、ロケールメッセージに `{x}` トークンが含まれている必要があります。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

オプションの詳細については、 を参照してください。

使用方法の詳細:
- [名前付き補間](../../guide/essentials/syntax#named-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| named | NamedValue | 名前付き補間の値 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, plural: number): string;

複数形のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、複数形化された翻訳メッセージを返します。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

参照:
- [複数形化](../../guide/essentials/pluralization)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| plural | number | 取得する複数形文字列。1 は最初のものを返します。 |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, plural: number, options: TranslateOptions&lt;Locales&gt;): string;

複数形のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, plural: number, options: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、複数形化された翻訳メッセージを返します。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

オプションの詳細については、 を参照してください。

参照:
- [複数形化](../../guide/essentials/pluralization)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| plural | number | 取得する複数形文字列。1 は最初のものを返します。 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, defaultMsg: string): string;

欠落デフォルトメッセージのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、翻訳が見つからなかった場合、デフォルトメッセージを返します。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions&lt;Locales&gt;): string;

欠落デフォルトメッセージのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, defaultMsg: string, options: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、翻訳が見つからなかった場合、デフォルトメッセージを返します。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

オプションの詳細については、 を参照してください。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, list: unknown[]): string;

リスト補間のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[]): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、ロケールメッセージにリストの各プレースホルダーの `{0}`、`{1}`、... が含まれている必要があります。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

参照:
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| list | unknown[] | リスト補間の値 |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, list: unknown[], plural: number): string;

リスト補間と複数形のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], plural: number): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、ロケールメッセージにリストの各プレースホルダーの `{0}`、`{1}`、... が含まれ、複数形化された翻訳メッセージを返します。

参照:
- [複数形化](../../guide/essentials/pluralization)
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| list | unknown[] | リスト補間の値 |
| plural | number | 取得する複数形文字列。1 は最初のものを返します。 |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;

リスト補間と欠落デフォルトメッセージのロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], defaultMsg: string): string;
```

**詳細**

オーバーロードされた `t`。

参照:
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

このオーバーロードされた `t` では、ロケールメッセージにリストの各プレースホルダーの `{0}`、`{1}`、... が含まれ、翻訳が見つからなかった場合はデフォルトメッセージを返します。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| list | unknown[] | リスト補間の値 |
| defaultMsg | string | 翻訳が見つからなかった場合に返すデフォルトメッセージ |

#### 戻り値

翻訳されたメッセージ

### (key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions&lt;Locales&gt;): string;

リスト補間のロケールメッセージ翻訳

**シグネチャ:**
```typescript
<Key extends string>(key: Key | ResourceKeys | number, list: unknown[], options: TranslateOptions<Locales>): string;
```

**詳細**

オーバーロードされた `t`。

このオーバーロードされた `t` では、ロケールメッセージにリストの各プレースホルダーの `{0}`、`{1}`、... が含まれている必要があります。

翻訳が欠落している場合、オプションに従って警告を抑制することもできます。

オプションの詳細については、 を参照してください。

使用方法の詳細:
- [リスト補間](../../guide/essentials/syntax#list-interpolation)

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Key &#124; ResourceKeys &#124; number | ターゲットロケールメッセージキー |
| list | unknown[] | リスト補間の値 |
| options | TranslateOptions&lt;Locales&gt; | 翻訳の追加オプション |

#### 戻り値

翻訳されたメッセージ

## MissingHandler

**シグネチャ:**
```typescript
export type MissingHandler = (locale: Locale, key: Path, instance?: ComponentInternalInstance | GenericComponentInstance, type?: string) => string | void;
```

## useI18n

Vue I18n の Composition API を使用する

**シグネチャ:**
```typescript
export declare function useI18n<Schema = DefaultLocaleMessageSchema, Locales = 'en-US', Options extends UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = UseI18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>>(options?: Options): Composer<NonNullable<Options['messages']>, NonNullable<Options['datetimeFormats']>, NonNullable<Options['numberFormats']>, NonNullable<Options['locale']>>;
```

### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| Schema | i18n リソース（メッセージ、日時フォーマット、数値フォーマット）スキーマ、デフォルトは  |
| Locales | i18n リソーススキーマのロケール、デフォルトは `en-US` |

**詳細**

この関数は主に `setup` で使用されます。

オプションが指定された場合、Composer インスタンスがコンポーネントごとに作成され、コンポーネント上でローカライズできます。

オプションが指定されていない場合、グローバル Composer を使用してローカライズできます。

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| options | Options | オプション、[UseI18nOptions](composition#usei18noptions) を参照 |

### 戻り値

[Composer](composition#composer) インスタンス

**例**

ケース：コンポーネントリソースベースのローカリゼーション
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
   // 何かする ...

   return { ..., t, locale }
 }
}
</script>
```




## UseI18nOptions

`useI18n` の I18n オプション

**シグネチャ:**
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

**詳細**

`UseI18nOptions` は [ComposerAdditionalOptions](composition#composeradditionaloptions) と [ComposerOptions](composition#composeroptions) を継承しているため、これらのオプションを指定できます。

## VueMessageType

**シグネチャ:**
```typescript
export type VueMessageType = string | ResourceNode | VNode;
```
