# 複数化 (Pluralization)

メッセージをローカライズするには、一部の言語の複数化をサポートする必要がある場合があります。

Vue i18n は複数化をサポートしており、複数化機能を備えた翻訳 API を使用できます。

## 基本的な使用法

パイプ `|` 区切り文字を持つロケールメッセージを定義し、パイプ区切り文字で複数形を定義する必要があります。

ロケールメッセージは以下のようになります：

```js
const messages = {
  en: {
    car: 'car | cars',
    apple: 'no apples | one apple | {count} apples'
  }
}
```

ここでは、`car` と `apple` を持つ `en` ロケールオブジェクトがあります。

`car` には `car | cars` という複数形メッセージがあり、`apple` には `no apples | one apple | {count} apples` という複数形メッセージがあります。

これらの複数形メッセージは、翻訳 API で指定した数値に応じて、翻訳 API 内の各言語の選択ルールのロジックによって選択されます。

Vue I18n は複数化をサポートするいくつかの方法を提供しています。ここでは `$t` を使用します。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> `$t` にはいくつかのオーバーロードがあります。これらのオーバーロードについては、[API リファレンス](../../../api/vue/interfaces/ComponentCustomProperties.md#t) を参照してください。

> [!NOTE]
> 複数化をサポートするいくつかの方法は次のとおりです：
>
> - 注入されたグローバル `$t`
> - 組み込み翻訳コンポーネント (`i18n-t`)
> - `useI18n` からエクスポートされた `t` (Composition API モード用)

<!-- eslint-enable markdown/no-missing-label-refs -->

以下は、翻訳 API の使用例です。

```html
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>

<p>{{ $t('apple', 0) }}</p>
<p>{{ $t('apple', 1) }}</p>
<p>{{ $t('apple', 10, { count: 10 }) }}</p>
```

上記の `$t` の使用例では、最初の引数はロケールメッセージキーで、2 番目の引数は数値です。`$t` は結果として選択されたメッセージを返します。

結果は以下のようになります：

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

## 定義済みの暗黙的な引数

複数化のために数値を明示的に与える必要はありません。

それが何を意味するのかを理解するために例を見てみましょう！

ロケールメッセージは以下のようになります：

```js
const messages = {
  en: {
    apple: 'no apples | one apple | {count} apples',
    banana: 'no bananas | {n} banana | {n} bananas'
  }
}
```

ここでは、`apple` と `banana` を持つ `en` ロケールオブジェクトがあります。

`apple` には `no apples | one apple | {count} apples` という複数形メッセージがあり、`banana` には `no bananas | {n} banana | {n} bananas` という複数形メッセージがあります。

数値は、定義済みの名前付き引数 `{count}` および/または `{n}` を介してロケールメッセージ内でアクセスできます。必要に応じて、これらの定義済みの名前付き引数を上書きできます。

以下は、`$t` の使用例です：

```html
<p>{{ $t('apple', 10, { named: { count: 10 } }) }}</p>
<p>{{ $t('apple', 10) }}</p>

<p>{{ $t('banana', 1, { named: { n: 1 } }) }}</p>
<p>{{ $t('banana', 1) }}</p>
<p>{{ $t('banana', 100, { named: { n: 'too many' } }) }}</p>
```

上記のいくつかの例では、最初の引数はロケールメッセージキーで、2 番目の引数は数値またはオブジェクトです。

オブジェクトが指定された場合、それは名前付き補間と同等です。複数形メッセージ内の暗黙的な `n` または `count` を、引数を与えることで補間できます。

結果は以下のようになります：

```html
<p>10 apples</p>
<p>10 apples</p>

<p>1 banana</p>
<p>1 banana</p>
<p>too many bananas</p>
```

## カスタム複数化

ただし、このような複数化はすべての言語に適用されるわけではありません（たとえば、スラブ語派の言語には異なる複数化ルールがあります）。

これらのルールを実装するには、オプションの `pluralizationRules` オブジェクトを `VueI18n` コンストラクタオプションに渡すことができます。

スラブ語派の言語（ロシア語、ウクライナ語など）のルールを使用した非常に単純化された例：

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

上記で定義したカスタムルールを使用するには、`createI18n` の内部で以下のいずれかを設定します：

1. `pluralizationRules` (Options API 用)
*または*
2. `pluralRules` (Composition API 用)

以下のロケールのように：

```js
const i18n = createI18n({
  locale: 'ru',
  // Composition API 用に pluralRules を使用
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

以下のテンプレートを使用：

```html
<h2>Car:</h2>
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>
<p>{{ $t('car', 4) }}</p>
<p>{{ $t('car', 12) }}</p>
<p>{{ $t('car', 21) }}</p>

<h2>Banana:</h2>
<p>{{ $t('banana', 0) }}</p>
<p>{{ $t('banana', 4) }}</p>
<p>{{ $t('banana', 11) }}</p>
<p>{{ $t('banana', 31) }}</p>
```

結果は以下のようになります：

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
