# 日時フォーマット

## 基本的な使い方
日時を各地域のフォーマットでローカライズできます。

以下、日時のフォーマットの例です：

```js
const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  'ja-JP': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true
    }
  }
}
```

上記のように、名前付き日時フォーマット（例：`short`,`long`）を定義することがき、その際、[ECMA-402 Intl.DateTimeFormatのオプション](https://tc39.es/ecma402/#datetimeformat-objects)を使う必要があります。

その後、ロケールメッセージを使う際、`crateI18n`の`datetimeFormats`オプションを指定する必要があります：

```js
const i18n = createI18n({
  datetimeFormats
})
```

Vue I18nで日時の値をローカライズするには、`$d`を使います。

:::tip 備考
`$d`にはいくつかのオーバーロードがあります。この点については、[API リファレンス](../../api/injection#d-value)を参照してください。
:::

:::tip 備考
日時のローカライズの手段には以下があります：

- `$d`（Legacy APIモード & Composition APIモード用）
- ビルトインのDatetimeFormatコンポーネント（`i18n-d`）
- `useI18n`からエクスポートされた`d`（Composition APIモード用）
:::

以下は、テンプレートでの`$d`の使用例です。

```html
<p>{{ $d(new Date(), 'short') }}</p>
<p>{{ $d(new Date(), 'long', 'ja-JP') }}</p>
```

`$d`のパラメータとして、第1引数に日時として扱える値（例：`Date`, timestamp）、第2引数に日時フォーマット名、第3引数にロケールの値を渡します。

出力は以下のようになります：

```html
<p>Apr 19, 2017</p>
<p>2017年4月19日(水) 午前2:19</p>
```

## カスタムフォーマット

:::danger 備考
[IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)では`Intl.DateTimeForamt#formatToParts`のサポートがないため、カスタムフォーマットは使えません。

使いたい場合、[polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)を使う必要があります。
:::

`$d`は、フォーマットされた日時の文字列を返しますが、これは全体でのみ使用できます。日時の一部 (端数など) を整形する必要がある場合には、`$d` では不十分です。そのような場合には、DatetimeFormatコンポーネント (`i18n-d`) が役に立ちます。

最小限のプロパティのセットで、`i18n-d`は`$d`と同じ出力を、構成されたDOM要素でラップして生成します。

以下はその例です：

```html
<i18n-d tag="p" :value="new Date()"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long" locale="ja-JP-u-ca-japanese"></i18n-d>
```

DatetimeFormatコンポーネントにはいくつかのpropsがあります。

`tag`はタグをセットするプロパティです。

`value`は日時として扱える、フォーマットする値をセットするプロパティです。

`format`は`createI18n`の`datetimeFormats`オプションで定義されたフォーマットがセットできるプロパティです。

`locale`はロケールをセットするプロパティです。`createI18n`の`locale`オプションで指定したロケールの代わりに、このpropで指定したロケールでローカライズされます。

出力は以下のようになります：

```html
<p>11/3/2020</p>
<p>11/03/2020, 02:35:31 AM</p>
<p>令和2年11月3日火曜日 午前2:35:31 日本標準時</p>
```

このコンポーネントが真価を発揮するのは[スコープ付きスロット](https://v3.vuejs.org/guide/component-slots.html#scoped-slots)を使う時です。

例えば、日時の元号部分を太字で表示したいなら、`era`スコープ付きスロット要素を指定すれば実現できます：

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
</i18n-d>
```

上のテンプレートは次のHTMLを出力します：

```html
<span><span style="color: green;">R</span>2年11月3日火曜日 午前2:35:31 日本標準時</span>
```

複数のスコープ付きスロットを同時に指定することもできます：

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
  <template #literal="props">
    <span style="color: green">{{ props.literal }}</span>
  </template>
</i18n-d>
```

（この例では可読性を高めるためにフォーマットしています）

```html
<span>
  <span style="color: green;">R</span>2
  <span style="color: green;">年</span>11
  <span style="color: green;">月</span>3
  <span style="color: green;">日</span>火曜日
  <span style="color: green;"> </span>午前3
  <span style="color: green;">:</span>09
  <span style="color: green;">:</span>56
  <span style="color: green;"> </span>日本標準時
</span>
```

:::tip 備考
サポートされているスコープ付きスロットやその他`i18n-d`のプロパティの一覧は[API リファレンス](../../api/component.html#datetimeformat)で確認できます。
:::

## スコープの解決

DatetimeFormat コンポーネントのスコープ解決は Translation コンポーネントと同じです。

詳細は、[こちら](../advanced/component.md#scope-resolving)のドキュメントをお読みください。