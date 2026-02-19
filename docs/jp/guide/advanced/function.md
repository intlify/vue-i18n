# メッセージ関数

Vue I18n では、メッセージを翻訳する際のロケールメッセージとして、リスト、名前付き、リテラル形式に基づく文字列を使用することを推奨しています。

ただし、文字列ベースのメッセージフォーマット構文では解決が難しい場合があります。

たとえば、フランス語で次のメッセージを処理したいとします：

- Manger de la soupe
- Manger une pomme
- Manger du pain
- Manger de l’orge

ご覧のとおり、名詞の前の冠詞は性別や音声によって異なります。

Vue I18n メッセージフォーマット構文でサポートされている機能では、これらの言語固有のユースケースをサポートできない場合があります。

しかし、複雑な言語構文のため、JavaScript の完全なプログラム機能を本当に必要とする状況があります。
そのため、文字列ベースのメッセージの代わりに **メッセージ関数** を使用できます。

:::tip NOTE
メッセージフォーマット構文で記述されたメッセージは、Vue I18n メッセージコンパイラを使用してメッセージ関数にコンパイルされます。メッセージ関数とキャッシュメカニズムにより、パフォーマンスの向上を最大化します。
:::

## 基本的な使用法

以下は、単純な挨拶を返すメッセージ関数です：

```js
const messages = {
  en: {
    greeting: (ctx) => 'hello!'
  }
}
```

メッセージ関数は、最初の引数として **メッセージコンテキスト (Message context)** を受け取ります。これにはいくつかのプロパティと関数があります。使用方法については次のセクションで説明しますので、先に進みましょう。

メッセージ関数の使用は非常に簡単です！`t`（`useI18n()` から）または `$t`（グローバルインジェクション経由）でメッセージ関数のキーを指定するだけです：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting') }}</p>
```

出力は以下のようになります：

```html
<p>hello!</p>
```

メッセージ関数は、メッセージ関数の戻り値の **文字列** のメッセージを出力します。

:::tip NOTE
Translation コンポーネント (`i18n-t`) を使用する必要がある場合は、文字列値だけでなく **VNode** 値も返すようにサポートする必要があります。

Translation コンポーネントの使用をサポートするために、次のコード例に示すように、MessageContext の `type` プロパティが使用されます：

```js
import { createVNode, Text } from 'vue'

const messages = {
  en: {
    greeting: ({ type }) => type === 'vnode'
      ? createVNode(Text, null, 'hello', 0)
      : 'hello'
  }
}
```

まだ読んでいない場合は、メッセージ関数に取り組む前に [Vue レンダリング関数](https://ja.vuejs.org/guide/extras/render-function.html#the-virtual-dom-tree) を一読することをお勧めします。
:::

## 名前付き補間

Vue I18n は、文字列ベースのメッセージフォーマットとして [名前付き補間](../essentials/syntax#named-interpolation) をサポートしています。Vue I18n は `$t` または `t` でパラメータ値を補間し、出力できます。

メッセージコンテキストの `named` 関数を使用して同じことができます。

これは挨拶の例です：

```js
const messages = {
  en: {
    greeting: ({ named }) => `hello, ${named('name')}!`
  }
}
```

テンプレート：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting', { name: 'DIO' }) }}</p>
```

出力は以下のようになります：

```html
<p>hello, DIO!</p>
```

`$t` または `t` の named で指定された値を解決するキーを指定する必要があります。

## リスト補間

Vue I18n は、文字列ベースのメッセージフォーマットとして [リスト補間](../essentials/syntax#list-interpolation) をサポートしています。Vue I18n は `$t` または `t` でパラメータ値を補間し、出力できます。

メッセージコンテキストの `list` 関数を使用して同じことができます。

これは挨拶の例です：

```js
const messages = {
  en: {
    greeting: ({ list }) => `hello, ${list(0)}!`
  }
}
```

テンプレート：

<!-- eslint-skip -->

```html
<p>{{ $t('greeting', ['DIO']) }}</p>
```

出力は以下のようになります：

```html
<p>hello, DIO!</p>
```

`$t` または `t` の list で指定された値を解決するインデックスを指定する必要があります。


## リンクメッセージ

Vue I18n は、文字列ベースのメッセージフォーマットとして [リンクメッセージ](../essentials/syntax#linked-messages) をサポートしています。Vue I18n は `$t` または `t` でパラメータ値を補間し、出力できます。

メッセージコンテキストの `linked` 関数を使用して同じことができます。

これはメッセージ関数の例です：

```js
const messages = {
  en: {
    the_world: 'the world',
    dio: 'DIO:',
    linked: ({ linked }) => `${linked('message.dio')} ${linked('message.the_world')} !!!!`
  }
}
```

テンプレート：

<!-- eslint-skip -->

```html
<p>{{ $t('linked') }}</p>
```

出力は以下のようになります：

```html
<p>DIO: the world !!!!</p>
```

`$t` または `t` で指定された値を解決するキーを指定する必要があります。

## 複数化

Vue I18n は、文字列ベースのメッセージフォーマットとして [複数化](../essentials/pluralization) をサポートしています。Vue I18n は `$t` または `t` でパラメータ値を補間し、出力できます。

メッセージコンテキストの `plural` 関数を使用して同じことができます。

これはメッセージ関数の例です：

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

テンプレート：

<!-- eslint-skip -->

```html
<p>{{ $t('car', 1) }}</p>
<p>{{ $t('car', 2) }}</p>

<p>{{ $t('apple', 0) }}</p>
<p>{{ $t('apple', 1) }}</p>
<p>{{ $t('apple', { count: 10 }, 10) }}</p>
```

出力は以下のようになります：

```html
<p>car</p>
<p>cars</p>

<p>no apples</p>
<p>one apple</p>
<p>10 apples</p>
```

`$t` または `t` で指定された値を解決するキーを指定する必要があります。
