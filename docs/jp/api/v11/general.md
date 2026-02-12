# 一般

## createI18n

Vue I18n ファクトリ

**シグネチャ:**
```typescript
export declare function createI18n<Schema extends object = DefaultLocaleMessageSchema, Locales extends string | object = 'en-US', Options extends I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>> = I18nOptions<SchemaParams<Schema, VueMessageType>, LocaleParams<Locales>>, Messages extends Record<string, unknown> = NonNullable<Options['messages']> extends Record<string, unknown> ? NonNullable<Options['messages']> : {}, DateTimeFormats extends Record<string, unknown> = NonNullable<Options['datetimeFormats']> extends Record<string, unknown> ? NonNullable<Options['datetimeFormats']> : {}, NumberFormats extends Record<string, unknown> = NonNullable<Options['numberFormats']> extends Record<string, unknown> ? NonNullable<Options['numberFormats']> : {}, OptionLocale = Options['locale'] extends string ? Options['locale'] : Locale>(options: Options): I18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>;
```

### 型パラメータ

| パラメータ | 説明 |
| --- | --- |
| Schema | i18n リソース（メッセージ、日時フォーマット、数値フォーマット）スキーマ、デフォルトは  |
| Locales | i18n リソーススキーマのロケール、デフォルトは `en-US` |

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| options | Options | オプション、[I18nOptions](general#i18noptions) を参照 |

### 戻り値

[I18n](general#i18n) インスタンス

参照:
- [クイックスタート](../../guide/essentials/started)
- [Composition API](../../guide/advanced/composition)

**例**


```js
import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

// I18n オプションで呼び出し
const i18n = createI18n({
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

// インストール！
app.use(i18n)
app.mount('#app')
```




## DefineDateTimeFormat

日時フォーマットの型定義

**シグネチャ:**
```typescript
export interface DefineDateTimeFormat extends DateTimeFormat
```

**詳細**

この型エイリアスは、日時フォーマットの型を厳密に定義するために使用されます。

これによって定義された型は、グローバルスコープで使用できます。

**例**


```ts
// type.d.ts (アプリの `.d.ts` ファイル)
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

ロケールメッセージの型定義

**シグネチャ:**
```typescript
export interface DefineLocaleMessage extends LocaleMessage<VueMessageType>
```

**詳細**

この型エイリアスは、ロケールメッセージの型を厳密に定義するために使用されます。

これによって定義された型は、グローバルスコープで使用できます。

**例**


```ts
// type.d.ts (アプリの `.d.ts` ファイル)
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

数値フォーマットの型定義

**シグネチャ:**
```typescript
export interface DefineNumberFormat extends NumberFormat
```

**詳細**

この型エイリアスは、数値フォーマットの型を厳密に定義するために使用されます。

これによって定義された型は、グローバルスコープで使用できます。

**例**


```ts
// type.d.ts (アプリの `.d.ts` ファイル)
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

エクスポートされたグローバル composer インスタンス

**シグネチャ:**
```typescript
export interface ExportedGlobalComposer
```

**詳細**

このインターフェースは、`app.config.globalProperties` を使用して各コンポーネントに注入されるインターフェースを提供する[グローバル composer](general#global) です。

### availableLocales

利用可能なロケール

**シグネチャ:**
```typescript
readonly availableLocales: Locale[];
```

**詳細**

このプロパティは `Composer#availableLocales` のプロキシのようなプロパティです。詳細については、を参照してください

### fallbackLocale

フォールバックロケール

**シグネチャ:**
```typescript
fallbackLocale: FallbackLocale;
```

**詳細**

このプロパティは `Composer#fallbackLocale` のプロキシのようなプロパティです。詳細については、を参照してください

### locale

ロケール

**シグネチャ:**
```typescript
locale: Locale;
```

**詳細**

このプロパティは `Composer#locale` のプロキシのようなプロパティです。詳細については、を参照してください

## I18n

I18n インスタンス

**シグネチャ:**
```typescript
export interface I18n<Messages extends Record<string, unknown> = {}, DateTimeFormats extends Record<string, unknown> = {}, NumberFormats extends Record<string, unknown> = {}, OptionLocale = Locale>
```

**詳細**

Vue プラグインとしてのインストールに必要なインスタンス

### global

グローバル Composer インスタンスにアクセス可能なプロパティ

このプロパティのインスタンスは **グローバルスコープ** です。

**シグネチャ:**
```typescript
readonly global: Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>;
```

### dispose()

グローバルスコープリソースの解放

**シグネチャ:**
```typescript
dispose(): void;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |

### install(app, options)

インストールエントリポイント

**シグネチャ:**
```typescript
install(app: App, ...options: unknown[]): void;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| app | App | ターゲット Vue アプリインスタンス |
| options | unknown[] | インストールオプション |

## I18nAdditionalOptions

I18n 追加オプション

**シグネチャ:**
```typescript
export interface I18nAdditionalOptions
```

**詳細**

`I18nAdditionalOptions` は、プラグインのインストールと動作制御のための特定の Vue I18n 設定オプションです。

### globalInjection

グローバルプロパティと関数を各コンポーネントに注入するかどうか。

**シグネチャ:**
```typescript
globalInjection?: boolean;
```

**詳細**

`true` に設定すると、`$` で始まるプロパティとメソッドが Vue コンポーネントに注入されます。

参照:
- [注入されたプロパティと関数の暗黙的使用](../../guide/advanced/composition#implicit-with-injected-properties-and-functions)
- リンク ComponentCustomProperties

 `true`

## I18nOptions

`createI18n` 用の I18n オプション

**シグネチャ:**
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
} | string = Locale, Options = ComposerOptions<Schema, Locales>> = I18nAdditionalOptions & Options;
```

## I18nPluginOptions

Vue I18n プラグインオプション

**シグネチャ:**
```typescript
export interface I18nPluginOptions
```

**詳細**

`app.use` を使用して Vue I18n を Vue プラグインとしてインストールするときに指定されるオプション。

### globalInstall

Vue I18n が提供するコンポーネントをグローバルにインストールするかどうか

**シグネチャ:**
```typescript
globalInstall?: boolean;
```

**詳細**

このオプションが有効な場合、コンポーネントは `app.use` 時にグローバルにインストールされます。

`import` 構文で手動でインストールしたい場合は、`false` に設定して必要に応じてインストールできます。

 `true`

## I18nScope

I18n スコープ

**シグネチャ:**
```typescript
export type I18nScope = 'local' | 'parent' | 'global';
```

## VERSION

Vue I18n バージョン

**シグネチャ:**
```typescript
VERSION: string
```

**詳細**

Semver 形式。package.json の `version` フィールドと同じ形式。

## DateTimeOptions

日時オプション

**シグネチャ:**
```typescript
export interface DateTimeOptions<Key = string, Locales = Locale> extends Intl.DateTimeFormatOptions, LocaleOptions<Locales>
```

**詳細**

日時フォーマット API のオプション

### fallbackWarn

**シグネチャ:**
```typescript
fallbackWarn?: boolean;
```

**詳細**

言語にキーのフォーマットがない場合にフォーマットキーを解決するかどうか

### key

**シグネチャ:**
```typescript
key?: Key;
```

**詳細**

ターゲットフォーマットキー

### missingWarn

**シグネチャ:**
```typescript
missingWarn?: boolean;
```

**詳細**

ローカリゼーション失敗時に出力される警告を抑制するかどうか

### part

**シグネチャ:**
```typescript
part?: boolean;
```

**詳細**

[Intel.DateTimeFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts) を使用するかどうか

## DefineCoreLocaleMessage

`@intlify/core-base` パッケージのロケールメッセージの型定義

**シグネチャ:**
```typescript
export interface DefineCoreLocaleMessage extends LocaleMessage<string>
```

**詳細**

この型エイリアスは、ロケールメッセージの型を厳密に定義するために使用されます。

**例**


```ts
// type.d.ts (アプリの `.d.ts` ファイル)
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

**シグネチャ:**
```typescript
export type FallbackLocale = Locale | Locale[] | {
    [locale in string]: Locale[];
} | false;
```

## fallbackWithLocaleChain

ロケールチェーンによるフォールバック

**シグネチャ:**
```typescript
export declare function fallbackWithLocaleChain<Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**詳細**

フォールバックチェーンアルゴリズムで実装されたフォールバックロケール関数。VueI18n でデフォルトとして使用されます。

**参照**
- [フォールバック](../../guide/essentials/fallback)

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| ctx | CoreContext&lt;Message&gt; | [コンテキスト](#corecontext) |
| fallback | FallbackLocale | [フォールバックロケール](general#fallbacklocale) |
| start | Locale | 開始[ロケール](general#locale) |

### 戻り値

フォールバックロケール

## fallbackWithSimple

単純な実装によるフォールバック

**シグネチャ:**
```typescript
export declare function fallbackWithSimple<Message = string>(_ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale): Locale[];
```

**詳細**

単純なフォールバックアルゴリズムで実装されたフォールバックロケール関数。

基本的には、`fallbackLocale` props で指定された値を返し、intlify 内部でフォールバック処理されます。

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| _ctx | CoreContext&lt;Message&gt; |  |
| fallback | FallbackLocale | [フォールバックロケール](general#fallbacklocale) |
| start | Locale | 開始[ロケール](general#locale) |

### 戻り値

フォールバックロケール

## LinkedModifiers

**シグネチャ:**
```typescript
export type LinkedModifiers<T = string> = {
    [key: string]: LinkedModify<T>;
};
```

## Locale

**シグネチャ:**
```typescript
export type Locale = IsNever<GeneratedLocale> extends true ? string : GeneratedLocale;
```

## LocaleDetector

**シグネチャ:**
```typescript
export interface LocaleDetector<Args extends any[] = any[]>
```

### resolvedOnce

### (...args: Args): Locale | Promise&lt;Locale&gt;;

## LocaleFallbacker

ロケールフォールバッカー

**シグネチャ:**
```typescript
export type LocaleFallbacker = <Message = string>(ctx: CoreContext<Message>, fallback: FallbackLocale, start: Locale) => Locale[];
```

## LocaleMessage

**シグネチャ:**
```typescript
export type LocaleMessage<Message = string> = Record<string, LocaleMessageValue<Message>>;
```

## LocaleMessageDictionary

**シグネチャ:**
```typescript
export type LocaleMessageDictionary<T, Message = string> = {
    [K in keyof T]: LocaleMessageType<T[K], Message>;
};
```

## LocaleMessages

**シグネチャ:**
```typescript
export type LocaleMessages<Schema, Locales = Locale, _Message = string> = LocaleRecord<UnionToTuple<Locales>, Schema>;
```

## LocaleMessageType

**シグネチャ:**
```typescript
export type LocaleMessageType<T, Message = string> = T extends string ? string : T extends () => Promise<infer P> ? LocaleMessageDictionary<P, Message> : T extends (...args: infer Arguments) => any ? (...args: Arguments) => ReturnType<T> : T extends Record<string, unknown> ? LocaleMessageDictionary<T, Message> : T extends Array<T> ? {
    [K in keyof T]: T[K];
} : T;
```

## LocaleMessageValue

**シグネチャ:**
```typescript
export type LocaleMessageValue<Message = string> = LocaleMessageDictionary<any, Message> | string;
```

## LocaleOptions

**シグネチャ:**
```typescript
export interface LocaleOptions<Locales = Locale>
```

### locale

**シグネチャ:**
```typescript
locale?: Locales | LocaleDetector;
```

**詳細**

ローカリゼーションのロケール

## MessageCompiler

メッセージコンパイラ

**シグネチャ:**
```typescript
export type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

## MessageCompilerContext

メッセージコンパイラに渡されるコンテキスト。

**シグネチャ:**
```typescript
export type MessageCompilerContext = Pick<CompileOptions, 'onError' | 'onCacheKey'> & {
    warnHtmlMessage?: boolean;
    key: string;
    locale: Locale;
};
```

## MessageContext

メッセージコンテキスト。

**シグネチャ:**
```typescript
export interface MessageContext<T = string>
```

### type

メッセージ関数によって処理されるメッセージタイプ。

**シグネチャ:**
```typescript
type: string;
```

**詳細**

通常は `text` で、メッセージ関数で **string** を返す必要があります。

### values

メッセージ値。

**シグネチャ:**
```typescript
values: Record<string, unknown>;
```

**詳細**

メッセージ値は、`$t`、`t`、`translate` などの翻訳関数から渡される引数値です。

**例**

vue-i18n `$t` (または `t`) の場合:
```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p> <!-- `{ name: 'DIO' }` はメッセージ値です -->
```

`@intlify/core` (`@intlify/core-base`) `translate` の場合:
```js
translate(context, 'foo.bar', ['dio']) // `['dio']` はメッセージ値です
```




### linked(key, modifier)

リンクメッセージを解決します。

**シグネチャ:**
```typescript
linked(key: Path, modifier?: string): MessageType<T>;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Path | メッセージキー |
| modifier | string | 修飾子 |

#### 戻り値

解決されたメッセージ。

### linked(key, modifier, type)

重載された `linked`

**シグネチャ:**
```typescript
linked(key: Path, modifier?: string, type?: string): MessageType<T>;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Path | メッセージキー |
| modifier | string | 修飾子 |
| type | string | メッセージタイプ |

#### 戻り値

解決されたメッセージ。

### linked(key, options)

重載された `linked`

**シグネチャ:**
```typescript
linked(key: Path, options?: LinkedOptions): MessageType<T>;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | Path | メッセージキー |
| options | LinkedOptions | [リンクオプション](#linkedoptions) |

#### 戻り値

解決されたメッセージ。

### list(index)

リストからメッセージ値を解決します。

**シグネチャ:**
```typescript
list(index: number): unknown;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| index | number | メッセージ値のインデックス。 |

#### 戻り値

解決されたメッセージ値。

**例**


```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```




### named(key)

名前付きからメッセージ値を解決します。

**シグネチャ:**
```typescript
named(key: string): unknown;
```

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| key | string | メッセージ値のキー。 |

#### 戻り値

解決されたメッセージ値。

**例**


```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```




### plural(messages)

複数形インデックスでメッセージを解決します。

**シグネチャ:**
```typescript
plural(messages: T[]): T;
```

**詳細**

翻訳関数を使用して複数形インデックスで解決されます。

#### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| messages | T[] | 翻訳関数を使用して複数形インデックスで解決されるメッセージ。 |

#### 戻り値

解決されたメッセージ。

**例**


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

メッセージ関数。

**シグネチャ:**
```typescript
export type MessageFunction<T = string> = MessageFunctionCallable | MessageFunctionInternal<T>;
```

## MessageFunctionReturn

**シグネチャ:**
```typescript
export type MessageFunctionReturn<T = string> = T extends string ? MessageType<T> : MessageType<T>[];
```

## MessageResolver

**シグネチャ:**
```typescript
export type MessageResolver = (obj: unknown, path: Path) => PathValue;
```

## NamedValue

**シグネチャ:**
```typescript
export type NamedValue<T = {}> = T & Record<string, unknown>;
```

## NumberOptions

数値オプション

**シグネチャ:**
```typescript
export interface NumberOptions<Key = string, Locales = Locale> extends Intl.NumberFormatOptions, LocaleOptions<Locales>
```

**詳細**

数値フォーマット API のオプション

### fallbackWarn

**シグネチャ:**
```typescript
fallbackWarn?: boolean;
```

**詳細**

言語にキーのフォーマットがない場合にフォーマットキーを解決するかどうか

### key

**シグネチャ:**
```typescript
key?: Key;
```

**詳細**

ターゲットフォーマットキー

### missingWarn

**シグネチャ:**
```typescript
missingWarn?: boolean;
```

**詳細**

ローカリゼーション失敗時に出力される警告を抑制するかどうか

### part

**シグネチャ:**
```typescript
part?: boolean;
```

**詳細**

[Intel.NumberFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts) を使用するかどうか

## Path

**シグネチャ:**
```typescript
export type Path = string;
```

## PathValue

**シグネチャ:**
```typescript
export type PathValue = string | number | boolean | Function | null | {
    [key: string]: PathValue;
} | PathValue[];
```

## PluralizationRules

**シグネチャ:**
```typescript
export type PluralizationRules = {
    [locale: string]: PluralizationRule;
};
```

## PostTranslationHandler

**シグネチャ:**
```typescript
export type PostTranslationHandler<Message = string> = (translated: MessageFunctionReturn<Message>, key: string) => MessageFunctionReturn<Message>;
```

## registerLocaleFallbacker

ロケールフォールバッカーを登録する

**シグネチャ:**
```typescript
export declare function registerLocaleFallbacker(fallbacker: LocaleFallbacker): void;
```

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| fallbacker | LocaleFallbacker | [LocaleFallbacker](general#localefallbacker) 関数 |

## registerMessageResolver

メッセージリゾルバーを登録する

**シグネチャ:**
```typescript
export declare function registerMessageResolver(resolver: MessageResolver): void;
```

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| resolver | MessageResolver | [MessageResolver](general#messageresolver) 関数 |

## resolveValue

メッセージリゾルバー

**シグネチャ:**
```typescript
export declare function resolveValue(obj: unknown, path: Path): PathValue;
```

**詳細**

メッセージを解決します。オブジェクトなどの階層構造を持つメッセージを解決できます。このリゾルバーは VueI18n でデフォルトとして使用されます。

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| obj | unknown | パスで解決されるターゲットオブジェクト |
| path | Path | メッセージの値を解決するための[パス](general#path) |

### 戻り値

解決された[パスの値](general#pathvalue)

## resolveWithKeyValue

キー値メッセージリゾルバー

**シグネチャ:**
```typescript
export declare function resolveWithKeyValue(obj: unknown, path: Path): PathValue;
```

**詳細**

キー値構造でメッセージを解決します。オブジェクトなどの階層構造を持つメッセージは解決できないことに注意してください

### パラメータ

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| obj | unknown | パスで解決されるターゲットオブジェクト |
| path | Path | メッセージの値を解決するための[パス](general#path) |

### 戻り値

解決された[パスの値](general#pathvalue)

## TranslateOptions

翻訳オプション

**シグネチャ:**
```typescript
export interface TranslateOptions<Locales = Locale> extends LocaleOptions<Locales>
```

**詳細**

翻訳 API のオプション

### default

**シグネチャ:**
```typescript
default?: string | boolean;
```

**詳細**

翻訳の欠落が発生した場合のデフォルトメッセージ

### escapeParameter

**シグネチャ:**
```typescript
escapeParameter?: boolean;
```

**詳細**

リストまたは名前付き補間値のパラメータをエスケープするかどうか

### fallbackWarn

**シグネチャ:**
```typescript
fallbackWarn?: boolean;
```

**詳細**

言語にキーの翻訳がない場合に翻訳キーでテンプレート補間を行うかどうか

### list

**シグネチャ:**
```typescript
list?: unknown[];
```

**詳細**

リスト補間

### missingWarn

**シグネチャ:**
```typescript
missingWarn?: boolean;
```

**詳細**

ローカリゼーション失敗時に出力される警告を抑制するかどうか

### named

**シグネチャ:**
```typescript
named?: NamedValue;
```

**詳細**

名前付き補間

### plural

**シグネチャ:**
```typescript
plural?: number;
```

**詳細**

複数形選択番号

### resolvedMessage

**シグネチャ:**
```typescript
resolvedMessage?: boolean;
```

**詳細**

メッセージが解決されたかどうか
