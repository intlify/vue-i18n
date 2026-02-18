# Composition API

Vue I18n は Composition API 用の `useI18n` コンポーザブルを提供しています。このセクションでは、`useI18n` を使用して翻訳関数にアクセスし、コンポーネントで i18n リソースを管理する方法を説明します。

## 基本的な使用法

`useI18n` の基本的な使い方を見てみましょう！ここでは、[クイックスタート](../essentials/started) のコードを変更して基本的な使い方を学びます。

まず、`createI18n` で i18n インスタンスを作成します：

```js
// ...

const i18n = VueI18n.createI18n({
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

これで、`App.vue` コンポーネントで `useI18n` を使用する準備が整いました。コードは以下のようになります：

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <h1>{{ t("message.hello") }}</h1>
</template>
```

`<script setup>` の先頭で `useI18n` を呼び出す必要があります。

`useI18n` は Composer インスタンスを返します。Composer インスタンスは、`t` 関数などの翻訳 API や、`locale`、`fallbackLocale` などのプロパティを提供します。Composer インスタンスの詳細については、[API リファレンス](../../../api/general/interfaces/Composer.md) を参照してください。

上記の例では、`useI18n` にオプションがないため、グローバルスコープで動作する Composer インスタンスを返します。つまり、`t` 関数によって参照されるローカライズされたメッセージは、`createI18n` で指定されたものになります。

出力は以下のようになります：

```html
<div id="app">
  <h1>こんにちは、世界</h1>
</div>
```

## メッセージ翻訳

以下のように Composer インスタンスの `t` を使用してメッセージを翻訳できます：

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

`t` の詳細については、[API リファレンス](../../../api/general/interfaces/Composer.md#t) を参照してください。

## 複数化

メッセージの複数形は同じ構文を使用し、`t` を使用して翻訳されます：

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
複数形の翻訳は `t` に統合されています。
:::

## 日時フォーマット

Composer インスタンスの `d` 関数を使用して日時値をフォーマットします：

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

`d` の詳細については、[API リファレンス](../../../api/general/interfaces/Composer.md#d) を参照してください。

## 数値フォーマット

Composer インスタンスの `n` 関数を使用して数値をフォーマットします：

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

`n` の詳細については、[API リファレンス](../../../api/general/interfaces/Composer.md#n) を参照してください。

## グローバルスコープ

グローバルスコープは、`createI18n` で i18n インスタンスが作成されるときに作成されます。i18n インスタンスの `global` プロパティは、グローバル Composer インスタンスを参照します。

コンポーネントでグローバルスコープの Composer インスタンスを参照するには、2 つの方法があります。

### `useI18n` を使用した明示的参照

`useI18n` に `useScope: 'global'` を渡すことで、グローバルスコープに明示的にアクセスできます：

<!-- eslint-skip -->

```ts
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

// Something to do here ...
```

上記のコードは `useI18n` オプションを `useScope: 'global'` に設定します。これにより、`useI18n` は i18n インスタンスの `global` プロパティによってアクセスできる Composer インスタンスを返すことができます。Composer インスタンスはグローバルスコープです。

その後、Composer インスタンスから公開された関数とプロパティを使用して構成できます。

:::tip NOTE
`useI18n` に `messages`、`datetimeFormats`、および `numberFormats` を `useScope: 'global'` と一緒に設定すると、**それらはグローバルスコープにマージされます**。つまり、それらはグローバルスコープ Composer インスタンスの `messages`、`datetimeFormasts`、および `numberFormats` によって管理されます。

また、[i18n カスタムブロックで `global` が指定されている場合](../advanced/sfc#define-locale-messages-for-global-scope)（例：`<i18n global>{ … }</i18n>`）、ブロックで定義されたロケールメッセージはグローバルスコープとマージされます。
:::

### 注入されたプロパティと関数を使用した暗黙的参照

グローバルスコープの Composer インスタンスを参照するもう 1 つの方法は、コンポーネントに暗黙的に注入されたプロパティと関数を使用することです。

デフォルト（`globalInjection: true`）では、Vue I18n は以下のプロパティと関数をコンポーネントに注入します：

- `$i18n`: 以下のグローバルスコーププロパティを持つオブジェクト
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
`setup` では、コンポーネントに注入されたこれらのプロパティと関数を参照することはできません。
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

ローカルスコープを有効にするには、`useI18n` にオプションを設定する必要があります。これにより、指定されたロケール、ロケールメッセージなどに基づいて Composer の新しいインスタンスが作成されます。オプションが指定されると、`useI18n` は、オプションで指定されたロケール、ロケールメッセージ、およびその他のリソースに基づいて新しい Composer インスタンスを作成して返します。

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

// Something to do here ...
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

`useI18n` からエクスポートされた `mergeLocaleMessage` を使用して、コンポーネント間でロケールメッセージを共有します。

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

locale.value = 'en' // change!
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

ローカルスコープのロケール、つまり `useI18n` によって返される Composer インスタンスの `locale` プロパティは、グローバルスコープから継承されます。したがって、グローバルスコープでロケールを変更すると、継承されたローカルスコープのロケールも変更されます。アプリケーション全体のロケールを切り替えたい場合は、`useI18n({ useScope: 'global' })` によって返される `locale` を使用するか、[暗黙的な方法](composition#implicit-with-injected-properties-and-functions) を使用する場合は `$i18n.locale` を使用できます。

:::tip NOTE
グローバルスコープからロケールを継承したくない場合は、`useI18n` の `inheritLocale` オプションを `false` にする必要があります。
:::

:::warning NOTICE
ローカルスコープでの `locale` の変更は、**グローバルスコープのロケールには影響せず、ローカルスコープ内でのみ有効です**。
:::

## VueI18n から Composer へのマッピング

v11 以前から移行する場合は、VueI18n インスタンス（Legacy API）と Composer インスタンス（Composition API）の詳細なマッピングについて、[v12 破壊的変更](../migration/breaking12#drop-legacy-api-mode) を参照してください。
