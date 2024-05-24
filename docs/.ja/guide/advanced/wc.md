# Web components

:::tip Supported Versions
:new: 9.2+
:::

Vue 3.2 以降から、[公式ドキュメント](https://v3.vuejs.org/guide/web-components.html)に記載されているとおり、Vue.js で Web components を利用できるようになりました。

それに伴い、Vue I18n v9.2 から Web Components で Vue I18n を使うことができるようサポートとしています。

Vue I18n を Web Components で利用するにあたって、いくつか注意点があります。


## I18n インスタンスをホストする Web Components を用意する

Vue 3.2 からサポートされた `defineCustomElement` を使って、SFC で実装した Vue コンポーネントを Web Components として提供することができます。つまり、`useI18n` を使って実装された Vue コンポーネントは、i18n がサポートされた Web Components として提供できることを意味します。

しかしながら、その提供された Web Components をそのまま HTML に挿入して使うことはできません。`createI18n` で生成された i18n インスタンスをホストする以下のような Web Components を用意する必要があります。

i18n インスタンスをホストする Web Components:
```html
<script lang="ts">
import { defineComponent, provide } from 'vue'
import { createI18n, I18nInjectionKey } from 'vue-i18n'

/**
 * create an i18n instance to host for other web components
 */
const i18n = createI18n<false>({
  legacy: false, // must set to `false`
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

export default defineComponent({
  // ...
  setup(props) {
    /**
     * provide i18n instance with `I18nInjectionKey` for other web components
     */
    provide(I18nInjectionKey, i18n)

    // ...

    return {}
  }
})
</script>

<!-- template to slot the content -->
<template>
  <slot />
</template>
```

上記コードのポイントは以下の3つです。

- `createI18n` を呼び出して、i18n インスタンスを生成
- `setup` で、`createI18n` で生成した i18n インスタンスを `provide` に `I18nInjectionKey` といっしょに指定する
- template は `slot` 要素のみ

`script` ブロックでは、まず `createI18n` を使って i18n インスタンスを生成しています。`ceateI18n` は Vue I18n を使う上で、最初にセットアップが必要な関数です。Vue アプリケーションにおいては、`createI18n` で生成された i18n インスタンスを、`createApp` で生成された Vue アプリケーション `app.use` に i18n インスタンスを指定することで、Vue I18n を Vue プラグインとして Vue アプリケーションにインストールする必要がありました。

Vue コンポーネントに対して `defineCustomElement` 使うと、その Vue コンポーネントはもはやVue アプリケーション側から制御できなくなってしまうため、例え Vue アプリケーション上で、その Web Components 化されたものを動かしたとしても、Vue アプリケーション側から `createI18n` で生成された i18n インスタンスを `app.use` 経由で対象先の Web Components にアタッチできません。

そのため、Web Components に i18n インスタンスをアタッチするために、`setup` 内で `provide` を使って i18n インスタンスを他の Web Components に公開しています。これにより、`useI18n` で i18n が実装されている Web Components が、`provide` が実行されている Web Components にホストされることで、動作するようになります。

そして、他の Web Components をホストするために、`template` ブロックでは、`slot` 要素を使うことで可能にしています。

このホストする Web Components を以下のようにexportsし:

```javascript
import { defineCustomElement } from 'vue'
import I18nHost from './components/I18nHost.ce.vue'

const I18nHostElement = defineCustomElement(I18nHost)

export { I18nHostElement }
```

以下のような `useI18n` が実装、そして exportされた Web Components を:

```html
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <p>{{ t('hello') }}</p>
</template>
```

```javascript
import { defineCustomElement } from 'vue'
import HelloI18n from './components/HelloI18n.ce.vue'

const HelloI18nElement = defineCustomElement(HelloI18n)
export { HelloI18nElement }
```

以下のような Vue アプリケーションで Web Components のカスタム要素として登録した場合:

```javascript
import { createApp } from 'vue'
import { I18nHostElement } from './paht/to/I18nHostElement'
import { HelloI18nElement } from './paht/to/HelloI18nElement'
import App from './App.vue'

customElements.define('i18n-host', I18nHostElement)
customElements.define('hello-i18n', HelloI18nElement)

createApp(App).mount('#app')
```

Vue アプリケーションのエントリポイントとなる `App.vue` では以下のように template することで動作します:

```html
<template>
  <i18n-host>
    <h1>Vue I18n in Web component</h1>
    <hello-i18n />
  </i18n-host>
</template>
```

ここまで説明した完全なexampleは、[こちら](https://github.com/intlify/vue-i18n/tree/master/examples/web-components)にあります。

## 制限事項
1. Web Components を実装する際に利用できる Vue I18n は **Composition API のみ**です。
2. Web Components を実装する際に `useI18n` で実装された **Vue コンポーネントをimportして一緒に使用することはできません。**これは、Vue.jsの Web Components 向けの [Provide / Inject](https://v3.vuejs.org/guide/web-components.html#definecustomelement) の制限によるためです。


