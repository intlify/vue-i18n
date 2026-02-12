# 日時フォーマット

## 基本的な使用法

定義したフォーマットで日時をローカライズできます。

日時のフォーマットは以下のとおりです：

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

上記のように、名前付きの日時フォーマット（例：`short`、`long` など）を定義できます。また、[ECMA-402 Intl.DateTimeFormat のオプション](https://tc39.es/ecma402/#datetimeformat-objects) を使用する必要があります。

その後、ロケールメッセージを使用するときに、`createI18n` の `datetimeFormats` オプションを指定する必要があります：

```js
const i18n = createI18n({
  datetimeFormats
})
```

Vue I18n で日時値をローカライズするには、`$d` を使用します。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> VueI18n v9 では、オプション名は `dateTimeFormats` ではなく **`datetimeFormats`** であることに注意してください。詳細については、[マイグレーションガイド](../../guide/migration/breaking#rename-to-datetimeformats-from-datetimeformats) を参照してください。

> [!TIP]
> `$d` には複数のオーバーロードがあります。詳細については [API リファレンス](../../api/vue/interfaces/ComponentCustomProperties.md#d) を参照してください。

> [!NOTE]
> ローカライズをサポートするいくつかの方法は次のとおりです：
>
> - `$d` (Legacy API モードおよび Composition API モード用)
> - 組み込み DatetimeFormat コンポーネント (`i18n-d`)
> - `useI18n` からエクスポートされた `d` (Composition API モード用)

<!-- eslint-enable markdown/no-missing-label-refs -->

以下は、テンプレートでの `$d` の使用例です：

```html
<p>{{ $d(new Date(), 'short') }}</p>
<p>{{ $d(new Date(), 'long', 'ja-JP') }}</p>
```

最初の引数はパラメータとしての日時可能な値（例：`Date`、タイムスタンプ）で、2 番目の引数はパラメータとしての日時フォーマット名です。最後の引数はパラメータとしてのロケール値です。

結果は以下のようになります：

```html
<p>Apr 19, 2017</p>
<p>2017年4月19日(水) 午前2:19</p>
```

## カスタムフォーマット

`$d` は完全にフォーマットされた日時を含む結果の文字列を返すため、全体としてしか使用できません。フォーマットされた日時の一部（小数桁など）のスタイルを設定する必要がある場合、`$d` では不十分です。そのような場合は、DatetimeFormat コンポーネント (`i18n-d`) が役立ちます。

最小限のプロパティセットで、`i18n-d` は `$d` と同じ出力を生成し、設定された DOM 要素にラップします。

以下のテンプレート：

```html
<i18n-d tag="p" :value="new Date()"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long" locale="ja-JP-u-ca-japanese"></i18n-d>
```

DatetimeFormat コンポーネントにはいくつかの props があります。

`tag` はタグを設定するためのプロパティです。

`value` プロパティは、フォーマットされる日時可能な値を設定するためのプロパティです。

`format` プロパティは、`createI18n` の `datetimeFormats` オプションで定義されたフォーマットを設定できるプロパティです。

`locale` プロパティは、ロケールを設定するためのプロパティです。`createI18n` の `locale` オプションで指定されたロケールではなく、この prop で指定されたロケールでローカライズされます。

以下の出力が生成されます：

```html
<p>11/3/2020</p>
<p>11/03/2020, 02:35:31 AM</p>
<p>令和2年11月3日火曜日 午前2:35:31 日本標準時</p>
```

しかし、このコンポーネントの真の力は、[スコープ付きスロット](https://ja.vuejs.org/guide/components/slots.html#scoped-slots) と一緒に使用されたときに発揮されます。

日時の元号部分を太字のフォントでレンダリングする必要があるとします。これは、`era` スコープ付きスロット要素を指定することで実現できます：

```html
<i18n-d tag="span" :value="new Date()" locale="ja-JP-u-ca-japanese" :format="{ key: 'long', era: 'narrow' }">
  <template #era="props">
    <span style="color: green">{{ props.era }}</span>
  </template>
</i18n-d>
```

上記のテンプレートは、以下の HTML になります：

```html
<span><span style="color: green;">R</span>2年11月3日火曜日 午前2:35:31 日本標準時</span>
```

複数のスコープ付きスロットを同時に指定することが可能です：

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

（この結果の HTML は読みやすくするためにフォーマットされています）

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

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> サポートされているスコープ付きスロットの完全なリストおよびその他の `i18n-d` プロパティは、[API リファレンス](../../api/general/type-aliases/DatetimeFormat.md) にあります。

<!-- eslint-enable markdown/no-missing-label-refs -->

## スコープ解決

DatetimeFormat コンポーネントのスコープ解決は Translation コンポーネントと同じです。

[こちら](../advanced/component.md#scope-resolving) を参照してください。
