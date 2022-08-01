# フォールバック

`fallbackLocale: '<lang>'`を指定することで、希望する言語の翻訳がない場合にどの言語を使用するかを選択することができます。

## ロケールを使用した暗黙のフォールバック

地域とオプションの方言を含む`locale`が与えられた場合、暗黙のフォールバックが自動的に有効になります。

たとえば、`de-DE-bavarian`は次のようにフォールバックします。
1. `de-DE-bavarian`
1. `de-DE`
1. `de`

自動フォールバックを無効にするには、ロケールの後部に感嘆符`!`を追加します（例：`de-DE!`）。

## 1つのロケールによる明示的なフォールバック

一部のアイテムが一部の言語に翻訳されないことがあります。この例では、`hello`というアイテムは、英語には対応していますが、日本語には対応していません。

```js
const messages = {
  en: {
    hello: 'Hello, world!'
  },
  ja: {
  }
}
```

希望するロケールでアイテムが利用できない場合に、（例えば）`en`のアイテムを使用したい場合は、`createI18n`で`fallbackLocale`オプションを設定します：

```js
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages
})
```

テンプレート：

```html
<p>{{ $t('hello') }}</p>
```

アウトプット：

```html
<p>Hello, world!</p>
```

デフォルトでは、`fallbackLocale`にフォールバックすると、2つのコンソール警告が発生します：

```
[intlify] Not found 'hello' key in 'ja' locale messages.
[intlify] Fall back to translate 'hello' key with 'en' locale.
```

1つ目の警告メッセージでは、翻訳関数`$t`に与えられたキーが`ja`ロケールのメッセージにないと出力され、2つ目の警告メッセージは、`en`ロケールのメッセージでフォールバックしたときに出力されます。これらの警告メッセージは、Vue I18nを使う際のデバッグをサポートするために出力されます。

:::tip 備考
これらの警告メッセージはデフォルトで開発モード（`process.env.NODE_ENV !== 'production'`）でのみ出力され、プロダクションでは出力されません。
:::

これらの警告を無効にするには（与えられたキーに対する翻訳が全くないことを警告するものは残ります）、`createI18n`の初期化時に`silentTranslationWarn: true`、`silentFallbackWarn: true`を設定します。

## ロケールの配列による明示的なフォールバック

ロケールの配列を使って、複数のフォールバックロケールを設定することができます。以下はその例です。

```javascript
fallbackLocale: [ 'fr', 'en' ],
```

## 設定マップによる明示的なフォールバック

予備のロケールに対するより複雑な設定が必要な場合、予備のロケールに応じた設定マップを定義することができます。

次のような設定マップを使用します。

```javascript
fallbackLocale: {
  /* 1 */ 'de-CH':   ['fr', 'it'],
  /* 2 */ 'zh-Hant': ['zh-Hans'],
  /* 3 */ 'es-CL':   ['es-AR'],
  /* 4 */ 'es':      ['en-GB'],
  /* 5 */ 'pt':      ['es-AR'],
  /* 6 */ 'default': ['en', 'da']
},
```

以下のようなフォールバックチェーンになります：

| ロケール | フォールバックチェーン |
|--------|-----------------|
| `'de-CH'`   | de-CH > fr > it > en > da |
| `'de'`      | de > en > da |
| `'zh-Hant'` | zh-Hant > zh-Hans > zh > en > da |
| `'es-SP'`   | es-SP > es > en-GB > en > da |
| `'es-SP!'`  | es-SP > en > da |
| `'fr'`      | fr > en > da |
| `'pt-BR'`   | pt-BR > pt > es-AR > es > en-GB > en > da |
| `'es-CL'`   | es-CL > es-AR > es > en-GB > en > da |

## フォールバック補間

`formatFallbackMessages: true`を設定すると、あなたの言語でキーに対する翻訳がない場合、翻訳キーのテンプレート補間を行います。

翻訳のキーは文字列なので、（特定の言語の）ユーザーが読めるメッセージをキーとして使うことができます。以下はその例です。

```javascript
const messages = {
  ja: {
    'Hello, world!': 'こんにちは、世界!'
  }
}
```

これは、"Hello, world！"という文字列の英語への翻訳を指定する必要がないので便利です。

キーの中にテンプレートのパラメータを含めることもできます。`formatFallbackMessages: true`と一緒に使えば、「基本」言語用のテンプレートを書く必要がなくなり、キー*が*テンプレートとなります。

```javascript
const messages = {
  ru: {
    'Hello {name}': 'Здравствуйте {name}'
  }
}

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  formatFallbackMessages: true,
  messages
})
```

テンプレートが以下のような時：

```html
<p>{{ $t('Hello {name}', { name: 'John' }}) }}</p>
<p>{{ $t('The weather today is {condition}!', { condition: 'sunny' }) }}</p>
```

出力は以下のようになります：

```html
<p>Здравствуйте, John</p>
<p>The weather today is sunny!</p>
```
