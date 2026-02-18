:::warning v11 ドキュメント
これは **Vue I18n v11** のドキュメントです。v12 以降を使用している場合は、[最新のガイド](/jp/guide/essentials/started) を参照してください。
:::

# カスタムディレクティブ

:::danger NOTE
`v-t` ディレクティブはバージョン 11 で非推奨になり、バージョン 12 で削除されます。このセクションは、バージョン 10 をまだ使用しているユーザーを対象としています。
:::

`$t` の使用に加えて、`v-t` カスタムディレクティブを使用して翻訳することもできます。

## 文字列構文

文字列構文を使用して、ロケールメッセージのキーパスを渡すことができます。

### JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'hi there!' },
    ja: { hello: 'こんにちは！' }
  }
})

const app = createApp({
  data: () => ({ path: 'hello' })
})
app.use(i18n)
app.mount('#app')
```

### テンプレート:

<!-- eslint-skip -->

```html
<div id="string-syntax">
  <!-- 文字列リテラルを使用 -->
  <p v-t="'hello'"></p>
  <!-- data を介してキーパスをバインド -->
  <p v-t="path"></p>
</div>
```

### 出力:

```html
<div id="string-syntax">
  <p>hi there!</p>
  <p>hi there!</p>
</div>
```

## オブジェクト構文

あるいは、オブジェクト構文を使用することもできます。

### JavaScript:

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hi: 'Hi, {name}!'
        bye: 'Goodbye!',
        apple: 'no apples | one apple | {count} apples'
      }
    },
    ja: {
      message: {
        hi: 'こんにちは、{name}！',
        bye: 'さようなら！',
        apple: 'リンゴはありません | 一つのりんご | {count} りんご'
      }
    }
  }
})

const app = createApp({
  data() {
    return {
      byePath: 'message.bye',
      appleCount: 7,
    }
  }
})
app.use(i18n)
app.mount('#object-syntax')
```

### テンプレート:

<!-- eslint-skip -->

```html
<div id="object-syntax">
  <!-- 引数付きオブジェクトを使用 -->
  <p v-t="{ path: 'message.hi', args: { name: 'kazupon' } }"></p>
  <!-- data を介してキーパスをバインド -->
  <p v-t="{ path: byePath, locale: 'en' }"></p>
  <!-- 複数化 -->
  <p v-t="{ path: 'message.apple', plural: appleCount }"></p>
</div>
```

### 出力:

```html
<div id="object-syntax">
  <p>こんにちは、kazupon！</p>
  <p>Goodbye!</p>
  <p>7 りんご</p>
</div>
```

## スコープ

[スコープセクション](../essentials/scope.md) で説明したように、`vue-i18n` はグローバルスコープとローカルスコープの両方をサポートしています。

`v-t` の動作は、それが使用されるスコープによって異なります：

- **ローカルスコープ**: Legacy API スタイルで i18n オプションを使用する場合、または `useI18n` で `useScope: 'local'` を設定する場合に適用されます。
- **グローバルスコープ**: その他のすべての場合に使用されます。

## `$t` vs `v-t`

### `$t`

`$t` は、以下の利点と欠点を持つ `VueI18n` インスタンスの関数です：

#### 利点:
- Mustache 構文 `{}` を含む、テンプレート内での **柔軟な使用** が可能です。
- Vue コンポーネント内の算出プロパティとメソッドをサポートします。

#### 欠点:
- `$t` は **再レンダリングごとに実行される** ため、翻訳のオーバーヘッドが増加する可能性があります。

### `v-t`

`v-t` は、独自の利点と欠点を持つカスタムディレクティブです：

#### 利点:
- [vue-i18n-extensions](https://github.com/intlify/vue-i18n-extensions) が提供する Vue コンパイラモジュールによって翻訳を前処理できるため、`$t` よりも **優れたパフォーマンス** を提供します。
- ランタイムの翻訳オーバーヘッドを削減することで、**パフォーマンスの最適化** を可能にします。

#### 欠点:
- `$t` よりも柔軟性が低く、使用が **より複雑** です。
- 翻訳されたコンテンツを要素の `textContent` に直接挿入するため、インライン HTML 構造内で使用したり、他の動的テンプレート式と組み合わせたりすることはできません。
- サーバーサイドレンダリング (SSR) を使用する場合は、`@vue/compiler-ssr` の `compile` 関数で `directiveTransforms` オプションを設定して [カスタム変換](https://github.com/intlify/vue-i18n-extensions#server-side-rendering-for-v-t-custom-directive) を設定する必要があります。