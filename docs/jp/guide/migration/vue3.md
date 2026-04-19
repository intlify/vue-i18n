# Vue 3 での移行

## Legacy API から Composition API への移行

### 概要

Vue I18n は、Legacy API モードと Composition API モードの両方のスタイルをサポートしています。Legacy API モードは Options API スタイルであり、Composition API モードは関数で構成できる Vue Composition API をサポートしています。

Legacy API モードは、従来の Vue I18n v8.x とほぼ互換性があり、Vue アプリケーションを Vue 3 に移行するのが比較的簡単です。Vue 3 は Options API スタイルをサポートしているため、既存の Vue 2 アプリケーションは Vue 3 に移行されるケースになります。

Vue 3 では、Options API スタイルと Composition API スタイルを組み合わせて Vue アプリケーションを作成できますが、Vue I18n は v9 の初期リリース以降、これらの API スタイルの混合を許可していないため、どちらか一方の API スタイルのみを使用できます。

Options API スタイルと Composition API スタイルを組み合わせて Vue アプリケーションを開発することは、メンテナンスの観点から望ましいソフトウェア開発プロジェクトではありません。そのようなコードを維持するコストが高いためです。ただし、両方のスタイルを使用することには利点があります。特に、API スタイルの移行は、両方の API スタイルで実装されていても機能するため、段階的に移行するのが簡単です。

Vue I18n v9.2 から、Legacy API モードは Composition API モードと一緒に使用することもできます。

### サポートについて

:::danger 通知
この移行サポートは、次のメジャーバージョン v10 で削除されます。Vue 3 アプリケーションプロジェクトがまだ移行されていない場合は、v9 に移行してから v10 にアップグレードしてください。
:::

### 制限事項

:::warning 通知
移行のための制限された機能として理解する必要があります。
:::

- Legacy API モードの Composition API は SSR をサポートしていません
- `<template>` ではなく `setup` 関数コンテキストで Vue I18n Composition API（例：`t`）を直接正しく使用したい場合は、`nextTick` コールバックコンテキストを介して呼び出す必要があります。

### 移行方法

#### `createI18n`

`createI18n` オプションに `allowComposition: true` を指定する必要があります。以下の例：

```js
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  allowComposition: true, // これを指定する必要があります！
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  }
})

console.log(i18n.allowComposition) // 出力は true
```

### Vue コンポーネントでの `useI18n`
#### `setup` オプション

<!-- eslint-skip -->

```vue
<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Hello',
  setup() {
    const { t } = useI18n() // グローバルスコープとして使用
    return { t }
  }
})
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```

#### `<script setup>`

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // グローバルスコープとして使用
</script>

<template>
  <p>{{ $t('hello') }}</p>
  <p>{{ t('hello') }}</p>
</template>
```
