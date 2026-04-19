:::warning v11 ドキュメント
これは **Vue I18n v11** のドキュメントです。v12 以降を使用している場合は、[最新のガイド](/jp/guide/essentials/started) を参照してください。
:::

# Composition API

`setup` と Vue の [Composition API](https://ja.vuejs.org/guide/extras/composition-api-faq.html) の導入により、新たな可能性が開かれました。しかし、Vue I18n の可能性を最大限に引き出すには、`this` へのアクセスを置き換えるためにいくつかの新しい関数を使用する必要があります。

これまで、vue-i18n v8.x と互換性のある Legacy API を使用して Vue I18n の機能を説明してきました。ここでは、Composition API 用の Vue I18n `useI18n` について見ていきましょう。

## 基本的な使用法

Vue I18n Composition API の基本的な使い方を見てみましょう！ここでは、[クイックスタート](../essentials/started) のコードを変更して基本的な使い方を学びます。

Vue 3 の `setup` で `useI18n` を使用して構成するには、1 つ行う必要があります。`createI18n` 関数の `legacy` オプションを `false` に設定する必要があります。

以下は、`createI18n` に `legacy` オプションを追加する例です：

```js{4}
// ...

const i18n = VueI18n.createI18n({
  legacy: false, // Composition API を使用するには `false` を設定する必要があります // [!code ++]
  locale: 'ja',
  fallbackLocale: 'en',
  messages: {
    en: {
      message: {
        hello: 'hello world'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界'
      }
    }
  }
})

// ...
```

`legacy: false` を設定することで、Vue I18n が API モードを Legacy API モードから Composition API モードに切り替えることができます。

:::tip NOTE
`createI18n` によって作成された i18n インスタンスの以下のプロパティは、その動作を変更します：

- `mode` プロパティ: `"legacy"` から `"composition"` へ
- `global` プロパティ: VueI18n インスタンスから Composer インスタンスへ
:::

これで、`App.vue` コンポーネントで `useI18n` を使用する準備が整いました。コードは以下のようになります：

<!-- eslint-skip -->

```vue
<script setup> // [!code ++]
import { useI18n } from 'vue-i18n' // [!code ++]
const { t } = useI18n() // [!code ++]
</script> // [!code ++]

<template>
  <h1>{{ $t("message.hello") }}</h1>
</template>
```

`<script setup>` の先頭で `useI18n` を呼び出す必要があります。

`useI18n` は Composer インスタンスを返します。Composer インスタンスは、VueI18n インスタンスと同様に、`t` 関数などの翻訳 API や、`locale`、`fallbackLocale` などのプロパティを提供します。Composer インスタンスの詳細については、[API リファレンス](/api/general/interfaces/Composer.md) を参照してください。

上記の例では、`useI18n` にオプションがないため、グローバルスコープで動作する Composer インスタンスを返します。したがって、グローバルスコープで動作する Composer インスタンスを返すため、ここで展開された `t` 関数によって参照されるローカライズされたメッセージは、`createI18n` で指定されたものになります。

コンポーネントテンプレートで `t` を使用できます：

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ $t("message.hello") }}</h1> // [!code --]
  <h1>{{ t("message.hello") }}</h1> // [!code ++]
</template>
```

出力は以下のようになります：

```vue
<div id="app">
  <h1>こんにちは、世界</h1>
</div>
```

## メッセージ翻訳

Legacy API モードでは、メッセージは `$t` または VueI18n インスタンスの `t` を使用して翻訳されていました。

Composition API モードでは、メッセージフォーマット構文は Legacy API モードと同じままです。以下のように Composer インスタンス `t` を使用してメッセージを翻訳できます：

```vue
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      msg: 'hello',
      named: '{msg} world!',
      list: '{0} world!',
      literal: "{'hello'} world!",
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:dio @:the_world !!!!'
    },
    ja: {
      msg: 'こんにちは',
      named: '{msg} 世界！',
      list: '{0} 世界！',
      literal: "{'こんにちは'} 世界！",
      the_world: 'ザ・ワールド！',
      dio: 'ディオ:',
      linked: '@:dio @:the_world ！！！！'
    }
  }
})

const msg = computed(() => t('msg'))
</script>

<template>
  <p>{{ t('named', { msg }) }}</p>
  <p>{{ t('list', [msg]) }}</p>
  <p>{{ t('literal') }}</p>
  <p>{{ t('linked') }}</p>
</template>

```

`t` の詳細については、[API リファレンス](/api/general/interfaces/Composer.md#t) を参照してください。

## 複数化

Composition API モードでは、メッセージの複数形は Legacy API モードと同様に構文に残りますが、Composer インスタンスの `t` を使用して翻訳されます：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      car: 'car | cars',
      apple: 'no apples | one apple | {count} apples',
      banana: 'no bananas | {n} banana | {n} bananas'
    }
  }
})
</script>

<template>
  <h2>Car:</h2>
  <p>{{ t('car', 1) }}</p>
  <p>{{ t('car', 2) }}</p>
  <h2>Apple:</h2>
  <p>{{ t('apple', 0) }}</p>
  <p>{{ t('apple', 1) }}</p>
  <p>{{ t('apple', { count: 10 }, 10) }}</p>
  <p>{{ t('apple', 10) }}</p>
  <h2>Banana:</h2>
  <p>{{ t('banana', { n: 1 }, 1) }}</p>
  <p>{{ t('banana', 1) }}</p>
  <p>{{ t('banana', { n: 'too many' }, 100) }}</p>
</template>
```

:::tip NOTE
Composition API モードでは、複数形の翻訳は `t` に統合されました。
:::

## 日時フォーマット

Legacy API モードでは、日時値は `$d` または VueI18n インスタンスの `d` を使用してフォーマットされていました。

Composition API モードでは、Composer インスタンスの `d` を使用してフォーマットします：

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, d } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      current: 'Current Datetime'
    }
  },
  datetimeFormats: {
    'en-US': {
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    }
  }
})

const now = ref(new Date())
</script>

<template>
  <p>{{ t('current') }}: {{ d(now, 'long') }}</p>
</template>

```

`d` の詳細については、[API リファレンス](/api/general/interfaces/Composer.md#d) を参照してください。

## 数値フォーマット

Legacy API モードでは、数値は `$n` または VueI18n インスタンスの `n` を使用してフォーマットされていました。

Composition API モードでは、Composer インスタンスの `n` を使用してフォーマットします：

```vue
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, n } = useI18n({
  locale: 'en-US',
  messages: {
    'en-US': {
      money: 'Money'
    }
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
})

const money = ref(1000)
</script>

<template>
  <p>{{ t('money') }}: {{ n(money, 'currency') }}</p>
</template>
```

`n` の詳細については、[API リファレンス](/api/general/interfaces/Composer.md#n) を参照してください。

## グローバルスコープ

Composition API モードのグローバルスコープは、Legacy API モードと同様に、`createI18n` で i18n インスタンスが作成されるときに作成されます。

Legacy API モードの i18n インスタンスの `global` プロパティは VueI18n インスタンスですが、Composition API モードでは Composer インスタンスを参照できます。

コンポーネントでグローバルスコープの Composer インスタンスを参照するには、2 つの方法があります。

### `useI18n` を使用した明示的参照

説明したように、`useI18n` は 1 つの方法です。

<!-- eslint-skip -->

```ts
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// ここで何かを行う ...
```

上記のコードは `useI18n` オプションを `useScope: 'global'` に設定します。これにより、`useI18n` は i18n インスタンスの `global` プロパティによってアクセスできる Composer インスタンスを返すことができます。Composer インスタンスはグローバルスコープです。

その後、Composer インスタンスから公開された関数とプロパティを使用して構成できます。

:::tip NOTE
`useI18n` に `messages`、`datetimeFormats`、および `numberFormats` を `useScope: 'global'` と一緒に設定すると、**それらはグローバルスコープにマージされます**。つまり、それらはグローバルスコープ Composer インスタンスの `messages`、`datetimeFormats`、および `numberFormats` によって管理されます。

また、[i18n カスタムブロックで `global` が指定されている場合](../advanced/sfc#define-locale-messages-for-global-scope)（例：`<i18n global>{ … }</i18n>`）、ブロックで定義されたロケールメッセージはグローバルスコープとマージされます。
:::

### 注入されたプロパティと関数を使用した暗黙的参照

グローバルスコープの Composer インスタンスを参照するもう 1 つの方法は、コンポーネントに暗黙的に注入されたプロパティと関数を使用することです。

デフォルトでは無効になっているため、`createI18n` のオプションとして **`globalInjection: true`** と `legacy: false` を指定する必要があります。

:::tip NOTE
vue-i18n v9.2-beta.34 以降では、`globalInjection` はデフォルトで `true` です。
:::

これにより、Vue I18n は以下のプロパティと関数をコンポーネントに注入できます：

- `$i18n`: 以下のグローバルスコープ Composer インスタンスプロパティでラップされたオブジェクト
  - `locale`
  - `fallbackLocale`
  - `availableLocales`
- `$t`: グローバルスコープである Composer の `t` 関数
- `$rt`: グローバルスコープである Composer の `rt` 関数
- `$d`: グローバルスコープである Composer の `d` 関数
- `$n`: グローバルスコープである Composer の `n` 関数
- `$tm`: グローバルスコープである Composer の `tm` 関数

Vue 3 ランタイムは、`app.config.globalProperties` に設定されているものをコンポーネントにグローバルに注入します。したがって、上記にリストされたものは Vue 3 ランタイムによって注入されるため、テンプレートで暗黙的に使用できます。

:::warning NOTICE
- `setup` では、コンポーネントに注入されたこれらのプロパティと関数を参照することはできません
- Legacy API モードでは、`$` で始まるいくつかの Vue I18n API が注入されましたが、Composition API モードでコンポーネントに `$` を付けて注入されるプロパティと関数は、Legacy API モードとは異なります。
:::

上記にリストされたものには `$` が付いていることに気づいたでしょう。それらに `$` を付ける理由は次のとおりです：

- `setup` は、レンダリングコンテキストによって返されるプロパティや関数と競合しません
- Vue I18n Composition API モードのグローバルスコープアクセス可能な識別子

そうすることで、ユーザーはそれらが特別なプロパティや関数であることを認識します。

:::warning NOTICE
Vue アプリケーションがローカルスコープを使用せず、すべての i18n をグローバルスコープで実行する場合、これは各コンポーネントの `setup` で `useI18n` を実行する必要がないため、非常に便利です。ただし、この方法には、同じ性質のグローバル変数の問題があります。特に大規模な Vue アプリケーションでは注意して使用する必要があります。

一度使用して使用を中止した場合は、テンプレートで使用されているすべてのプロパティまたは関数を、`useScope: 'global'` オプションを指定した `useI18n` を使用して `setup` で返されるセットアップコンテキストのものに変更する必要があります。
:::

## ローカルスコープ

Legacy API モードでは、各コンポーネントに `i18n` コンポーネントオプションを指定することで VueI18n インスタンスが作成されます。これにより、VueI18n インスタンスによって管理されるローカルメッセージなどのリソースを、ターゲットコンポーネントのみが参照できるローカルスコープにすることができます。

Composition API モードでローカルスコープを有効にするには、`useI18n` にオプションを設定する必要があります。これにより、指定されたロケール、ロケールメッセージなどに基づいて Composer の新しいインスタンスが作成されます。オプションが指定されると、`useI18n` は、オプションで指定されたロケール、ロケールメッセージ、およびその他のリソースに基づいて新しい Composer インスタンスを作成して返します。

:::tip NOTE
`useScope: 'local'` オプションを明示的に指定できます。
:::

以下のコード例：

<!-- eslint-skip -->

```js
import { useI18n } from 'vue-i18n'

const { t, d, n, tm, locale } = useI18n({
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  datetimeFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  },
  numberFormats: {
    'en-US': {
      // ....
    },
    'ja-JP': {
      // ...
    }
  }
})

// ここで何かを行う ...
```

### ロケールメッセージ

SFC で i18n カスタムブロックをロケールメッセージの i18n リソースとして使用する場合、それは `useI18n` の `messages` オプションで指定されたロケールメッセージとマージされます。

以下は、i18n カスタムブロックと `useI18n` オプションを使用する例です：

<!-- eslint-skip -->

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import en from './en.json'

const { t, availableLocales, getLocaleMessages } = useI18n({
  locale: 'en',
  messages: {
    en
  }
})

availableLocales.forEach(locale => {
  console.log(`${locale} locale messages`, getLocaleMessages(locale))
})
</script>

<i18n locale="ja">
{
  "hello": "こんにちは！"
}
</i18n>
```

:::tip NOTE
この例では、リソースの定義は i18n カスタムブロックと `useI18n` の `messages` オプションから分離されていますが、ローカルスコープでは、リソースメッセージの管理目的で、`messages` オプションでリソースメッセージを一括指定するか、すべてのリソースメッセージを i18n カスタムブロックで定義することが望ましいです。
:::

### コンポーネントの共有ロケールメッセージ

Legacy API モードでは、共有ロケールメッセージは `sharedMessages` オプションを持つコンポーネントで使用されます。

Composition API モードでは、`useI18n` からエクスポートされた `mergeLocaleMessage` を使用します。

共通ロケールメッセージの例：

```js
export default {
  en: {
    buttons: {
      save: "Save",
      // ...
    }
  },
  ja: {
    buttons: {
      save: "保存",
      // ...
    }
  }
}
```

コンポーネントで `mergeLocaleMessage` を使用する：

<!-- eslint-skip -->

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t, mergeLocaleMessage } = useI18n({
  locale: 'en',
  messages: {
    en: {
      hello: 'Hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

for (const locale of ['en', 'ja']) {
  mergeLocaleMessage(locale, commonMessages[locale])
}
</script>
```

## ロケールの変更

### グローバルスコープ

`<script setup>` でロケールを変更したい場合は、`useI18n` でグローバル Composer を取得し、インスタンスの `locale` プロパティを使用して変更するだけです。

<!-- eslint-skip -->

```vue
<script setup>
const { t, locale } = useI18n({ useScope: 'global' })

locale.value = 'en' // 変更！
</script>
```

また、テンプレートでセットアップコンテキストを使用することもでき、以下のように変更できます：

```vue
<select v-model="locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

グローバルスコープのロケールを変更すると、`t` 翻訳 API などのグローバルスコープに依存するコンポーネントはリアクティブに動作し、表示メッセージをターゲットロケールのものに切り替えることができます。

[暗黙的な方法](composition#implicit-with-injected-properties-and-functions) を使用している場合は、以下のように `$i18n.locale` を使用してテンプレートで変更することもできます：

```vue
<select v-model="$i18n.locale">
  <option value="en">en</option>
  <option value="ja">ja</option>
</select>
```

### ローカルスコープ

ローカルスコープのロケール、つまり `useI18n` によって返される Composer インスタンスの `locale` プロパティは、Legacy API と同様に、グローバルスコープから継承されます。したがって、グローバルスコープでロケールを変更すると、継承されたローカルスコープのロケールも変更されます。アプリケーション全体のロケールを切り替えたい場合は、`useI18n({ useScope: 'global' })` によって返される `locale` を使用するか、[暗黙的な方法](composition#implicit-with-injected-properties-and-functions) を使用する場合は `$i18n.locale` を使用できます。

:::tip NOTE
グローバルスコープからロケールを継承したくない場合は、`useI18n` の `inheritLocale` オプションを `false` にする必要があります。
:::

:::warning NOTICE
ローカルスコープでの `locale` の変更は、**グローバルスコープのロケールには影響せず、ローカルスコープ内でのみ有効です**。
:::

## VueI18n インスタンスと Composer インスタンス間のマッピング

Composition API の Composer インスタンスによって提供される API は、VueI18n インスタンスによって提供される API と非常に類似したインターフェースです。

:::tip MEMO
内部的には、Legacy API モードの VueI18n インスタンスは、Composer インスタンスをラップすることによって機能します。
このため、Composition API モードのパフォーマンスオーバーヘッドは、Legacy API モードよりも少なくなります。
:::

以下はマッピングテーブルです：

| VueI18n インスタンス | Composer インスタンス |
| ----------------- | ----------------------- |
| `id` | `id` |
| `locale` | `locale` |
| `fallbackLocale` | `fallbackLocale` |
| `availableLocales` | `availableLocales` |
| `messages` | `messages` |
| `datetimeFormats` | `datetimeFormats` |
| `numberFormats` | `numberFormats` |
| `modifiers` | `modifiers` |
| `missing` | `getMissingHandler` / `setMissingHandler` |
| `postTranslation` | `getPostTranslationHandler` / `setPostTranslationHandler`|
| `silentTranslationWarn` | `missingWarn` |
| `silentFallbackWarn` | `fallbackWarn` |
| `formatFallbackMessages` | `fallbackFormat` |
| `sync` | `inheritLocale` |
| `warnHtmlInMessage` | `warnHtmlMessage` |
| `escapeParameterHtml` | `escapeParameter` |
| `t` | `t` |
| `tc` | `t` |
| `te` | `te` |
| `tm` | `tm` |
| `getLocaleMessage` | `getLocaleMessage` |
| `setLocaleMessage` | `setLocaleMessage`|
| `mergeLocaleMessage` | `mergeLocaleMessage` |
| `d` | `d` |
| `getDateTimeFormat` | `getDateTimeFormat` |
| `setDateTimeFormat` | `setDateTimeFormat` |
| `mergeDateTimeFormat` | `mergeDateTimeFormat` |
| `n` | `n` |
| `getNumberFormat` | `getNumberFormat` |
| `setNumberFormat` | `setNumberFormat` |
| `mergeNumberFormat` | `mergeNumberFormat` |