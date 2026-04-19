# Web Components

:::tip Supported Versions
:new: 9.2+
:::

:::tip
この章の完全なサンプルコードは [こちら](https://github.com/intlify/vue-i18n/tree/master/examples/web-components) です
:::

Vue 3.2 以降、[公式ドキュメント](https://ja.vuejs.org/guide/extras/web-components.html) に記載されているように Web Components を使用できます。

これにより、Vue I18n v9.2 以降、Web Components での Vue I18n の使用がサポートされます。

Vue I18n を Web Components で使用する際には、いくつか留意すべき点があります。

## I18n インスタンスをホストするための Web Components の準備

Vue 3.2 以降サポートされている `defineCustomElement` を使用すると、SFC で実装された Vue コンポーネントを Web Components として提供できます。つまり、`useI18n` を使用して実装された Vue コンポーネントは、i18n サポート付きの Web Components として提供できます。

ただし、提供された Web Components を直接 HTML に挿入することはできません。`createI18n` によって作成された i18n インスタンスをホストするために、以下の Web Components を準備する必要があります。

i18n インスタンスをホストする Web Components：

```vue
<script setup lang="ts">
import { provide } from 'vue'
import { createI18n, I18nInjectionKey } from 'vue-i18n'

/**
 * 他の Web Components をホストするための i18n インスタンスを作成
 */
const i18n = createI18n<false>({
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

/**
 * 他の Web Components 用に `I18nInjectionKey` とともに i18n インスタンスを提供
 */
provide(I18nInjectionKey, i18n)
</script>

<!-- コンテンツをスロットするためのテンプレート -->
<template>
  <slot />
</template>
```

上記のコードには、以下の 3 つのポイントがあります。

- `createI18n` を呼び出して i18n インスタンスを作成する
- `setup` で、`createI18n` で作成された i18n インスタンスを `I18nInjectionKey` とともに `provide` で指定する
- テンプレートには `slot` 要素のみがある

`script` ブロックでは、まず `createI18n` を使用して i18n インスタンスを作成します。Vue アプリケーションでは、`createI18n` によって作成された i18n インスタンスは、`createApp` によって作成された Vue アプリケーション `app.use` で i18n インスタンスを指定することで、Vue プラグインとして使用できます。

`defineCustomElement` を使用する場合、Vue コンポーネントは Vue アプリケーション側から制御できなくなるため、コンポーネントの Web Components バージョンを Vue アプリケーションで実行しても、Vue アプリケーション側から `app.use` を介して `createI18n` で作成された i18n インスタンスをターゲット Web Components にアタッチすることはできません。

そのため、Web Components に i18n インスタンスをアタッチするために、`setup` で `provide` を使用して i18n インスタンスを他の Web Components に公開します。これにより、`useI18n` で i18n を実装する Web Components は、`provide` を機能させる Web Components によってホストされることで機能します。

次に、他の Web Components をホストするために、`template` ブロックは `slot` 要素を使用してこれを可能にします。

このホストされた Web Components を以下のようにエクスポートします：

```js
import { defineCustomElement } from 'vue'
import I18nHost from './components/I18nHost.ce.vue'

const I18nHostElement = defineCustomElement(I18nHost)

export { I18nHostElement }
```

以下の `useI18n` は Web Components を実装してエクスポートします：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <p>{{ t('hello') }}</p>
</template>
```

```js
import { defineCustomElement } from 'vue'
import HelloI18n from './components/HelloI18n.ce.vue'

const HelloI18nElement = defineCustomElement(HelloI18n)
export { HelloI18nElement }
```

以下の Vue アプリケーションが Web Components のカスタム要素として登録されている場合：

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import { I18nHostElement } from './path/to/I18nHostElement'
import { HelloI18nElement } from './path/to/HelloI18nElement'
import App from './App.vue'

customElements.define('i18n-host', I18nHostElement)
customElements.define('hello-i18n', HelloI18nElement)

createApp(App).mount('#app')
```

したがって、Vue アプリケーションのエントリポイントである `App.vue` では、以下のテンプレートが機能します：

```vue
<template>
  <i18n-host>
    <h1>Vue I18n in Web component</h1>
    <hello-i18n />
  </i18n-host>
</template>
```

これまでに説明した完全な例は [こちら](https://github.com/intlify/vue-i18n/tree/master/examples/web-components) で確認できます。

## 制限事項

1. Web Components の実装に使用できる Vue I18n は **Composition API** のみです。
2. Web Components を実装する場合、**`useI18n` で実装された Vue コンポーネントをインポートして一緒に使用することはできません**。これは、Web Components に対する Vue.js の [Provide / Inject](https://ja.vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue) 制限によるものです。
