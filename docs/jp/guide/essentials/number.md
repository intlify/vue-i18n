# 数値フォーマット

## 基本的な使用法

定義したフォーマットで数値をローカライズできます。

数値のフォーマットは以下のとおりです：

```js
const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency', currency: 'USD', notation: 'standard'
    },
    decimal: {
      style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
    },
    percent: {
      style: 'percent', useGrouping: false
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency', currency: 'JPY', useGrouping: true, currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal', minimumSignificantDigits: 3, maximumSignificantDigits: 5
    },
    percent: {
      style: 'percent', useGrouping: false
    }
  }
}
```

上記のように、名前付きの数値フォーマット（例：`currency` など）を定義できます。また、[ECMA-402 Intl.NumberFormat のオプション](https://tc39.es/ecma402/#numberformat-objects) を使用する必要があります。

その後、ロケールメッセージを使用するときに、`createI18n` の `numberFormats` オプションを指定する必要があります：

```js
const i18n = createI18n({
  numberFormats
})
```

Vue I18n で数値をローカライズするには、`$n` を使用します。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> `$n` にはいくつかのオーバーロードがあります。これらのオーバーロードについては、[API リファレンス](../../../api/vue/interfaces/ComponentCustomProperties.md#n) を参照してください。

<!-- eslint-enable markdown/no-missing-label-refs -->

以下は、テンプレートでの `$n` の使用例です：

```html
<p>{{ $n(10000, 'currency') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP') }}</p>
<p>{{ $n(10000, 'currency', 'ja-JP', { useGrouping: false }) }}</p>
<p>{{ $n(987654321, 'currency', { notation: 'compact' }) }}</p>
<p>{{ $n(0.99123, 'percent') }}</p>
<p>{{ $n(0.99123, 'percent', { minimumFractionDigits: 2 }) }}</p>
<p>{{ $n(12.11612345, 'decimal') }}</p>
<p>{{ $n(12145281111, 'decimal', 'ja-JP') }}</p>
```

最初の引数はパラメータとしての数値で、2 番目の引数はパラメータとしての数値フォーマット名です。最後の引数はパラメータとしてのロケール値です。

結果は以下のようになります：

```html
<p>$10,000.00</p>
<p>￥10,000</p>
<p>￥10000</p>
<p>$988M</p>
<p>99%</p>
<p>99.12%</p>
<p>12.12</p>
<p>12,145,000,000</p>
```

## カスタムフォーマット

`$n` は完全にフォーマットされた数値を含む結果の文字列を返すため、全体としてしか使用できません。フォーマットされた数値の一部（小数桁など）のスタイルを設定する必要がある場合、`$n` では不十分です。そのような場合は、NumberFormat コンポーネント (`i18n-n`) が役立ちます。

最小限のプロパティセットで、`i18n-n` は `$n` と同じ出力を生成し、設定された DOM 要素にラップします。

以下のテンプレート：

```html
<i18n-n tag="span" :value="100"></i18n-n>
<i18n-n tag="span" :value="100" format="currency"></i18n-n>
<i18n-n tag="span" :value="100" format="currency" locale="ja-JP"></i18n-n>
```

NumberFormat コンポーネントにはいくつかの props があります。

`tag` はタグを設定するためのプロパティです。

`value` は、フォーマットされる数値を設定するためのプロパティです。

`format` は、`createI18n` の `numberFormats` オプションで定義されたフォーマットを設定できるプロパティです。

`locale` は、ロケールを設定するためのプロパティです。`createI18n` の `locale` オプションで指定されたロケールではなく、この prop で指定されたロケールでローカライズされます。

以下の出力が生成されます：

```html
<span>100</span>
<span>$100.00</span>
<span>￥100</span>
```

しかし、このコンポーネントの真の力は、[スコープ付きスロット](https://ja.vuejs.org/guide/components/slots.html#scoped-slots) と一緒に使用されたときに発揮されます。

数値の整数部分を太字のフォントでレンダリングする必要があるとします。これは、`integer` スコープ付きスロット要素を指定することで実現できます：

```html
<i18n-n tag="span" :value="100" format="currency">
  <template #integer="slotProps">
    <span style="font-weight: bold">{{ slotProps.integer }}</span>
  </template>
</i18n-n>
```

上記のテンプレートは、以下の HTML になります：

```html
<span>$<span style="font-weight: bold">100</span>.00</span>
```

複数のスコープ付きスロットを同時に指定することが可能です：

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

（この結果の HTML は読みやすくするためにフォーマットされています）

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

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> サポートされているスコープ付きスロットの完全なリストおよびその他の `i18n-n` プロパティは、[API リファレンス](../../../api/general/type-aliases/NumberFormat.md) にあります。

<!-- eslint-enable markdown/no-missing-label-refs -->

## スコープ解決

NumberFormat コンポーネントのスコープ解決は Translation コンポーネントと同じです。

[こちら](../advanced/component.md#scope-resolving) を参照してください。
