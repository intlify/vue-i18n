# フォールバック (Fallbacking)

`fallbackLocale: '<lang>'` を使用して、希望する言語に翻訳がない場合に使用する言語を選択します。

## ロケールを使用した暗黙的なフォールバック

地域とオプションの方言を含む `locale` が指定された場合、暗黙的なフォールバックが自動的に有効になります。

例えば `de-DE-bavarian` は以下のようにフォールバックします：
1. `de-DE-bavarian`
2. `de-DE`
3. `de`

自動フォールバックを抑制するには、接尾辞として感嘆符 `!` を追加します。例えば `de-DE!` のようにします。

## 単一ロケールを使用した明示的なフォールバック

一部の項目が一部の言語に翻訳されていない場合があります。この例では、`hello` という項目は英語では利用可能ですが、日本語では利用できません：

```js
const messages = {
  en: {
    hello: 'Hello, world!'
  },
  ja: {
  }
}
```

希望するロケールで項目が利用できない場合に（例えば）`en` の項目を使用したい場合は、`createI18n` で `fallbackLocale` オプションを設定します：

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

出力：

```html
<p>Hello, world!</p>
```

デフォルトでは、`fallbackLocale` へのフォールバックは 2 つのコンソール警告を生成します：

```txt
[intlify] Not found 'hello' key in 'ja' locale messages.
[intlify] Fall back to translate 'hello' key with 'en' locale.
```

最初の警告メッセージは、翻訳関数 `$t` に指定されたキーが `ja` ロケールメッセージにないために出力されます。2 つ目の警告メッセージは、`en` ロケールメッセージからローカライズされたメッセージを解決するためにフォールバックしたときに出力されます。これらの警告メッセージは、Vue I18n を使用したデバッグをサポートするために出力されます。

:::tip NOTE
これらの警告メッセージは、デフォルトでは開発モード (`process.env`<wbr/>`.NODE_ENV !== 'production'`) でのみ警告され、本番環境では警告されません。
:::

最初の警告（`Not found key...`）を抑制するには、`createI18n` を初期化するときに `missingWarn: false` を設定します。

2 つ目の警告（`Fall back to...`）を抑制するには、`createI18n` を初期化するときに `fallbackWarn: false` を設定します。

## ロケールの配列を使用した明示的なフォールバック

ロケールの配列を使用して、複数のフォールバックロケールを設定することが可能です。例えば：

<!-- eslint-skip -->

```javascript
fallbackLocale: [ 'fr', 'en' ],
```

## 決定マップを使用した明示的なフォールバック

フォールバックロケールのより複雑な決定マップが必要な場合は、対応するフォールバックロケールを持つ決定マップを定義することが可能です。

以下の決定マップを使用する場合：

<!-- eslint-skip -->

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

以下のフォールバックチェーンになります：

| locale | フォールバックチェーン |
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

言語にキーの翻訳がない場合に、翻訳キーに対してテンプレート補間を行うには、`fallbackFormat: true` を設定します。

翻訳へのキーは文字列なので、ユーザーが読めるメッセージ（特定の言語用）をキーとして使用できます。
例：

```javascript
const messages = {
  ja: {
    'Hello, world!': 'こんにちは、世界!'
  }
}
```

これは、"Hello, world!" という文字列の英語への翻訳を指定する必要がないため便利です。

実際、キーにテンプレートパラメータを含めることさえできます。`fallbackFormat: true` と組み合わせることで、「ベース」言語のテンプレートを書くのをスキップできます。キーがテンプレート*そのもの*になります。

```javascript
const messages = {
  ru: {
    'Hello {name}': 'Здравствуйте {name}'
  }
}

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  fallbackFormat: true,
  messages
})
```

テンプレートが以下の場合：

```html
<p>{{ $t('Hello {name}', { name: 'John' }) }}</p>
<p>{{ $t('The weather today is {condition}!', { condition: 'sunny' }) }}</p>
```

以下が出力されます：

```html
<p>Здравствуйте, John</p>
<p>The weather today is sunny!</p>
```
