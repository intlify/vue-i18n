# ローカルスコープベースのローカリゼーション

## `useI18n` とローカルメッセージの使用

[*「スコープとロケールの変更」*](scope) で説明したように、Vue I18n にはグローバルスコープとローカルスコープの 2 つのスコープ概念があります。

一般的に、ロケール情報（例：`locale`、`messages` など）は `createI18n` のオプションとして設定され、`app.use` で設定（インストール）されます。つまり、グローバルスコープの翻訳関数 `t`（`useI18n()` から取得）または `$t` を使用してローカライズします。

ローカルメッセージのリソースを管理しながら、コンポーネントごとにローカライズする必要がある場合があります。この場合、グローバルスコープの代わりに、`useI18n()` にローカルメッセージを渡すか、`<i18n>` カスタムブロックを使用して各ローカルスコープをローカライズすると便利です。

:::tip NOTE
Vue I18n v11 以前の `i18n` コンポーネントオプションを使用している場合は、[v11 ガイド](../v11/essentials/local) を参照してください。
:::

以下は、ローカルスコープベースのローカリゼーションの例です：

**main.js:**

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

// setting locale info used by global scope as options
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello world',
        greeting: 'good morning, world!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、世界',
        greeting: 'おはよう、世界！'
      }
    }
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

**Component1.vue**（`useI18n` を使用したローカルスコープ）：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  messages: {
    en: { message: { hello: 'hello component1' } },
    ja: { message: { hello: 'こんにちは、component1' } }
  }
})
</script>

<template>
  <div class="component">
    <h1>Component1</h1>
    <p>Component1 locale messages: {{ t("message.hello") }}</p>
    <p>Fallback global locale messages: {{ t("message.greeting") }}</p>
  </div>
</template>
```

**App.vue:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import Component1 from './Component1.vue'

const { t } = useI18n()
</script>

<template>
  <div id="app">
    <h1>Root</h1>
    <p>{{ t("message.hello") }}</p>
    <Component1 />
  </div>
</template>
```

以下を出力します：

```html
<div id="app">
  <h1>Root</h1>
  <p>こんにちは、世界</p>
  <div class="component">
    <p>Component1 locale messages: こんにちは、component1</p>
    <p>Fallback global locale messages: おはよう、世界！</p>
  </div>
</div>
```

上記の例のように、コンポーネントにロケールメッセージがない場合は、グローバルスコープにフォールバックします。[ローカルスコープ](scope#ローカルスコープ-1) セクションで説明したように、ローカルスコープの `locale` はグローバルスコープから継承するため、コンポーネントはグローバルスコープで設定された言語を使用します（上記の例では `locale: 'ja'`）。

また、[1つのロケールによる明示的なフォールバック](fallback#explicit-fallback-with-one-locale) セクションで説明したように、デフォルトでは、グローバルスコープへのフォールバックによってコンソールに 2 つの警告が生成されることに注意してください：

```txt
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

コンポーネントのロケールを使用してローカライズしたい場合は、`useI18n()` のオプションで `inheritLocale: false` と `locale` を使用して行うことができます。

## コンポーネント間でのロケールメッセージの共有

グローバルスコープのロケールメッセージからフォールバックするのではなく、特定のコンポーネント間で共有されるロケールメッセージをインポートしたい場合があります（例：コンポーネントの特定の機能の共通メッセージ）。

`useI18n()` の `messages` オプションを使用して、共有メッセージをコンポーネントのローカルスコープにマージできます。

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

共有メッセージを使用するコンポーネント：

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import commonMessages from './locales/common'

const { t } = useI18n({
  messages: {
    en: { ...commonMessages.en, /* component-specific messages */ },
    ja: { ...commonMessages.ja, /* component-specific messages */ }
  }
})
</script>

<template>
  <div class="modal">
    <div class="body">
      <p>This is good service</p>
    </div>
    <div class="footer">
      <button type="button">{{ t('buttons.save') }}</button>
    </div>
  </div>
</template>
```

共有メッセージは、ターゲットコンポーネントの Composer インスタンスのロケールメッセージにマージされます。
