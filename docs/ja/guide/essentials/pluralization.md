# 複数化

メッセージをローカライズするには、いくつかの言語で複数形をサポートする必要があります。

Vue i18nは複数化をサポートし、翻訳APIは複数化の機能を持ちます。

## 基本的な使い方

パイプセパレータ`|`区切りで複数形を定義したロケールメッセージを定義します。

ロケールメッセージの例：

```js
const messages = {
  en: {
    car: 'car | cars',
    apple: 'no apples | one apple | {count} apples'
  }
}
```

上記は`en`ロケールで、`car`と`apple`プロパティを持つオブジェクトです。

`car`には、`car | cars`の複数形メッセージがあり、`apple`には、`no apples | one apple | {count} apples`の複数形メッセージがあります。

これらの複数形メッセージは、翻訳APIで指定した数値に応じて選択されます。

Vue I18nでは、いくつかの複数化の方法が提供されます。ここでは、`$tc`を使用します。

:::tip 備考
`$tc`にはいくつかのオーバーロードがあります。この点については[APIリファレンス](../../api/injection#tc-key)を参照してください。
:::

:::tip 備考
複数化をサポートする方法は以下です：

- `$tc` (Legacy APIモード用)
- カスタムディレクティブ`v-t`
- ビルトインの翻訳コンポーネント (`i18n-t`)
- `useI18n`からエクスポートされた`t` (コンポジションAPIモード用)
- インジェクトされたグローバル変数`$t` (コンポジションAPIモード用)
:::

以下は翻訳APIの使用例です：

```html
<p>{{ $tc('car', 1) }}</p>
<p>{{ $tc('car', 2) }}</p>

<p>{{ $tc('apple', 0) }}</p>
<p>{{ $tc('apple', 1) }}</p>
<p>{{ $tc('apple', 10, { count: 10 }) }}</p>
```

上の`$tc`の使用例では、第1引数にロケールメッセージキー、第2引数に数字を指定しています。

出力は以下のようになります：

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

## 定義済みの暗黙の引数

複数形にする場合は、明示的に数字を指定する必要はありません。

例を見てみましょう。

ロケールメッセージの例：

```js
const messages = {
  en: {
    apple: 'no apples | one apple | {count} apples',
    banana: 'no bananas | {n} banana | {n} bananas'
  }
}
```

上記は`apple`と`banana`をプロパティに持つ`en`ロケールのオブジェクトです。

`apple`は複数形メッセージ`no apples | one apple | {count} apples`を持ち、`banana`は複数形メッセージ`no bananas | {n} banana | {n} bananas`を持ちます。

ロケールメッセージの中で数値にアクセスするには、名前付き引数`{count}`や`{n}`を使用します。必要に応じて、これらの名前付き引数を上書きすることができます。

以下は`$tc`の使用例です：

```html
<p>{{ $tc('apple', 10, { count: 10 }) }}</p>
<p>{{ $tc('apple', 10) }}</p>

<p>{{ $tc('banana', 1, { n: 1 }) }}</p>
<p>{{ $tc('banana', 1) }}</p>
<p>{{ $tc('banana', 100, { n: 'too many' }) }}</p>
```

上記の例では、第1引数にロケールメッセージのキー、第2引数に数値またはオブジェクトを指定しています。

オブジェクトを指定した場合は、名前付き補間と同じになります。複数化メッセージに暗黙の引数を与えることで、`n`や`count`を補間することができます。

出力は以下のようになります：

```html
<p>10 apples</p>
<p>10 apples</p>

<p>1 banana</p>
<p>1 banana</p>
<p>too many bananas</p>
```

## カスタム複数化

しかし、このような複数化はすべての言語に適用されるわけではありません（たとえば、スラブ系の言語では複数化のルールが異なります）。

これらのルールを実装するには、`VueI18n`のコンストラクタのオプションに`pluralizationRules`オブジェクトを渡します。

スラブ系言語（ロシア語、ウクライナ語など）のルールを使った非常に単純な例：

```js
function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}
```

上記で定義したカスタムルールを使用するには、`createI18n`の`pluralizationRules`オプションに、以下のロケールのようなキーを設定します：

```js
const i18n = createI18n({
  locale: 'ru',
  // カスタムルール
  pluralizationRules: {
    ru: customRule
  },
  messages: {
    ru: {
      car: '0 машин | {n} машина | {n} машины | {n} машин',
      banana: 'нет бананов | {n} банан | {n} банана | {n} бананов'
    }
  }
})
```

テンプレート：

```html
<h2>Car:</h2>
<p>{{ $tc('car', 1) }}</p>
<p>{{ $tc('car', 2) }}</p>
<p>{{ $tc('car', 4) }}</p>
<p>{{ $tc('car', 12) }}</p>
<p>{{ $tc('car', 21) }}</p>

<h2>Banana:</h2>
<p>{{ $tc('banana', 0) }}</p>
<p>{{ $tc('banana', 4) }}</p>
<p>{{ $tc('banana', 11) }}</p>
<p>{{ $tc('banana', 31) }}</p>
```

出力は以下のようになります：

```html
<h2>Car:</h2>
<p>1 машина</p>
<p>2 машины</p>
<p>4 машины</p>
<p>12 машин</p>
<p>21 машина</p>

<h2>Banana:</h2>
<p>нет бананов</p>
<p>4 банана</p>
<p>11 бананов</p>
<p>31 банан</p>
```
