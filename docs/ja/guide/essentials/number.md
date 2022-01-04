# 数フォーマット

## 基本的な使い方

定義したフォーマットに従って数をローカライズできます。

数フォーマットの例：

```js
const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD'
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
    }
  }
}
```

上記のように、名前付き数フォーマット（例：`currency`）を定義することができ、[ECMA-402 Intl.NumberFormatのオプション](https://tc39.es/ecma402/#numberformat-objects)を使う必要があります。

その後、ロケールメッセージを使う際、`createI18n`の`numberFormats`オプションを指定する必要があります：

```js
const i18n = createI18n({
  numberFormats
})
```

Vue I18nで数値をローカライズするには、`$n`を使います。

:::tip 備考
`$n`にはいくつかのオーバーロードがあります。この点については、[API リファレンス](../../api/injection#n-value)を参照してください。
:::

以下は、テンプレートでの`$n`の使用例です。

```html
<p>{{ $n(100, 'currency') }}</p>
<p>{{ $n(100, 'currency', 'ja-JP') }}</p>
```

パラメータとして、第1引数に数値を、第2引数に数フォーマット名を、第3引数にロケール値を渡します。

出力は以下のようになります。

```html
<p>$100.00</p>
<p>￥100</p>
```

## カスタムフォーマット

:::danger 備考
[IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)では`Intl.NumberForamt#formatToParts`がサポートされていないため、この機能は使えません。

使いたい場合、[polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)を使う必要があります。
:::

`$n`はフォーマットされた数の文字列を返しますが、その値は全体としてのみ使えます。数の一部分（端数など）のスタイルを変えたい場合は、`$n`では不十分です。その場合、NumberFormatコンポーネント（`i18n-n`）が有効です。

最小限のプロパティのセットで、`i18n-n`は構成されたDOM要素でラップされた、`$n`と同じ出力を生成します。

以下はその例です：

```html
<i18n-n tag="span" :value="100"></i18n-n>
<i18n-n tag="span" :value="100" format="currency"></i18n-n>
<i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>
```

NumberFormatコンポーネントにはいくつかのpropsがあります。

`tag`はタグをセットするプロパティです。

`value`はフォーマットしたい数値をセットするプロパティです。

`format`は`createI18n`の`numberFormats`オプションで定義されたフォーマットをセットできるプロパティです。

`locale`はロケールをセットするプロパティです。`createI18n`の`locale`オプションで指定された値の代わりに、このpropで指定されたロケールでローカライズされます。

出力は以下のようになります：

```html
<span>100</span>
<span>$100.00</span>
<span>￥100</span>
```

このコンポーネントが真価を発揮するのは、[スコープ付きスロット](https://v3.ja.vuejs.org/guide/component-slots.html#%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%95%E3%82%9A%E4%BB%98%E3%81%8D%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88)を使う時です。

例えば数の整数部分を太字で表示したいならば、`integer`スコープ付きスロット要素を指定することで実現できます：

```html
<i18n-n tag="span" :value="100" format="currency">
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
</i18n-n>
```

上のテンプレートは次のHTMLを出力します：

```html
<span>$<span style="font-weight: bold">100</span>.00</span>
```

同時に複数のスコープ付きスロットを指定することもできます：

```html
<i18n-n tag="span" :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
  <template #currency="slotProps">
    <span style="color: green">{{ slotProps.currency }}</span>
  </template>
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
  <template #group="slotProps">
    <span style="font-weight: bold">{{ slotProps.group }}</span>
  </template>
  <template #fraction="slotProps">
    <span style="font-size: small">{{ slotProps.fraction }}</span>
  </template>
</i18n-n>
```

（この例では、読みやすくするためにフォーマットされています）

```html
<span>
  <span style="color: green">€</span>
  <span style="font-weight: bold">1</span>
  <span style="font-weight: bold">,</span>
  <span style="font-weight: bold">234</span>
  .
  <span style="font-size: small">00</span>
</span>
```

:::tip 備考
サポートされているスコープ付きスロットとその他`i18n-n`のプロパティの一覧は[API リファレンス](../../api/component.html#numberformat)で確認できます。
:::

## スコープの解決

NumberFormat コンポーネントのスコープ解決は Translation component と同じです。

詳細は、[こちら](../advanced/component.md#scope-resolving)のドキュメントをお読みください。