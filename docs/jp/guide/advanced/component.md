# コンポーネント補間

## 基本的な使用法

HTML タグやコンポーネントに含まれるロケールメッセージを使用してローカライズする必要がある場合があります。例：

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

上記のメッセージで `$t` を使用する場合、おそらく次のようなロケールメッセージを作成しようとするでしょう：

```js
const messages = {
  en: {
    term1: 'I Accept xxx\'s',
    term2: 'Terms of Service Agreement'
  }
}
```

そして、ローカライズされたテンプレートは次のようになります：

<!-- esline-skip -->

```html
<p>{{ $t('term1') }}<a href="/term">{{ $t('term2') }}</a></p>
```

出力：

```html
<p>I accept xxx <a href="/term">Terms of Service Agreement</a></p>
```

これは非常に面倒で、ロケールメッセージで `<a>` タグを設定する場合、`v-html="$t('term')"` でローカライズするため、XSS の脆弱性の可能性があります。

Translation コンポーネント (`i18n-t`) を使用して回避できます。例えば以下のようになります。

テンプレート：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="term" tag="label" for="tos">
    <a :href="url" target="_blank">{{ $t('tos') }}</a>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      tos: 'Term of Service',
      term: 'I accept xxx {0}.'
    },
    ja: {
      tos: '利用規約',
      term: '私は xxx の{0}に同意します。'
    }
  }
})

const app = createApp({
  data: () => ({ url: '/term' })
})

app.use(i18n)
app.mount('#app')
```

以下の出力：

```html
<div id="app">
  <!-- ... -->
  <label for="tos">
    I accept xxx <a href="/term" target="_blank">Term of Service</a>.
  </label>
  <!-- ... -->
</div>
```

上記の例については、[例](https://github.com/intlify/vue-i18n/blob/master/examples/legacy/components/translation.html) を参照してください

Translation コンポーネントの子は、`keypath` プロパティのロケールメッセージで補間されます。上記の例では、

:::v-pre
`<a :href="url" target="_blank">{{ $t('tos') }}</a>`
:::

`term` ロケールメッセージで補間されます。

上記の例では、コンポーネント補間は **リスト補間** に従います。Translation コンポーネントの子は、出現順に補間されます。

<!-- textlint-disable -->
`tag` プロパティを指定することで、ルートノードの要素タイプを選択できます。省略した場合、デフォルトで [Fragments](https://v3-migration.vuejs.org/new/fragments.html) になります。
<!-- textlint-enable -->

## スロット構文の使用法

名前付きスロット構文を使用する方が便利です。例えば以下のようになります：

テンプレート：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template v-slot:limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template v-slot:action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      info: 'You can {action} until {limit} minutes from departure.',
      change: 'change your flight',
      refund: 'refund the ticket'
    }
  }
})

const app = createApp({
  data: () => ({
    changeUrl: '/change',
    refundUrl: '/refund',
    changeLimit: 15,
    refundLimit: 30
  })
})

app.use(i18n)
app.mount('#app')
```

出力：

```html
<div id="app">
  <!-- ... -->
  <p>
    You can <a href="/change">change your flight</a> until <span>15</span> minutes from departure.
  </p>
  <!-- ... -->
</div>
```

テンプレートでは、以下のスロット省略形も使用できます：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="info" tag="p">
    <template #limit>
      <span>{{ changeLimit }}</span>
    </template>
    <template #action>
      <a :href="changeUrl">{{ $t('change') }}</a>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

:::warning LIMITATION
:warning: Translation コンポーネントでは、スロット props はサポートされていません。
:::

### 複数形の使用法

`plural` プロパティを使用することで、コンポーネント補間で複数形を使用できます。例えば以下のようになります。

テンプレート：

```html
<div id="app">
  <!-- ... -->
  <i18n-t keypath="message.plural" locale="en" :plural="count">
    <template #n>
      <b>{{ count }}</b>
    </template>
  </i18n-t>
  <!-- ... -->
</div>
```

JavaScript:

```js
const { createApp, ref } = Vue
const { createI18n } = VueI18n

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      message: {
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    }
  }
})

const app = createApp({
  setup() {
    const count = ref(2)
    return { count }
  }
})
app.use(i18n)
app.mount('#app')
```

以下の出力：
```html
<div id="app" data-v-app="">
  <!-- ... -->
  <b>2</b> bananas
  <!-- ... -->
</div>
```

## スコープ解決

Translation コンポーネントの [スコープ](../essentials/scope.md) 解決は、デフォルトで `parent` です。

これは、Translation コンポーネントが、それを使用する親コンポーネントで有効になっているスコープを使用することを意味します。

親コンポーネントが `useScope: 'global'` の `useI18n` を持っている場合はグローバルスコープを使用し、`useScope: 'local'` の場合は親コンポーネントのローカルスコープを使用します。

ただし、ブラウザコンソールで以下の警告メッセージが表示されることがあります：

```txt
[intlify] Not found parent scope. use the global scope.
```

このメッセージは、Translation コンポーネントを使用する親コンポーネントで `useI18n` を実行していない場合に表示されます。

その状況では、警告メッセージにあるように、Translation コンポーネントのスコープはグローバルスコープにフォールバックされます。

この警告を抑制する回避策は、Translation コンポーネントの `scope` プロパティとして `global` を指定することです。

```html
<i18n-t keypath="message.foo" scope="global">
  ...
</i18n-t>
```

:::tip NOTE
この警告は、プロダクションビルドではブラウザコンソールに出力されません。
:::

:::warning NOTE
これは petite-vue-i18n では利用できません
:::
