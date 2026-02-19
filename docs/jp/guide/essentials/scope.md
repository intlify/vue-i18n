# スコープとロケールの変更

## スコープ

Vue I18n は、ロケールの切り替え、ロケールメッセージと呼ばれる各言語のメッセージ、日時や数値の命名フォーマットなど、i18n 機能を提供するためにリソースを管理します。これらは Composer インスタンスで管理されます。

Vue アプリケーションは、ツリー構造上のいくつかのコンポーネントから構築されます。Vue I18n の i18n 機能を使用して各コンポーネントをローカライズするには、スコープの概念を理解する必要があります。

Vue I18n には以下の 2 つのスコープがあります：

- グローバルスコープ
- ローカルスコープ

![scope](/scope.png)

### グローバルスコープ

Vue のグローバルスコープを使用すると、アプリケーション内のすべてのコンポーネントにわたって国際化 (i18n) リソースにアクセスして管理できます。これは、i18n 管理を一元化する場合に特に役立ちます。

`createI18n` を使用して i18n インスタンスを作成すると、グローバルスコープが自動的に作成されます。このグローバルスコープは Composer インスタンスに紐付けられており、i18n インスタンスの `global` プロパティを介してアクセスできます。

`useI18n()` でローカルメッセージが指定されていない場合、グローバルスコープが使用されます。ローカルメッセージが提供されていない場合、`useI18n()` が返す Composer インスタンスはグローバル Composer を参照します。

### ローカルスコープ

Vue のローカルスコープを使用すると、単一ファイルコンポーネントでの `<style scoped>` の動作と同様に、コンポーネントごとに i18n リソースを管理できます。コンポーネントがローカルスコープを持つ場合、そのコンポーネントの i18n リソースのみがアクティブになります。これは、各コンポーネントに固有のロケールメッセージを管理したい場合に特に便利です。

ローカルスコープは、`useI18n()` でメッセージを指定するか、SFC で `<i18n>` カスタムブロックを使用することで有効になります。これにより、コンポーネントの初期化時に新しい Composer インスタンスが作成されます。その結果、そのコンポーネントで `useI18n()` が返す Composer インスタンスは、グローバル Composer インスタンスとは異なります。

## ロケールの変更

ここまでスコープの概念について説明してきました。スコープを理解すれば、ロケールの変更方法を理解するのは簡単です。

### グローバルスコープ

アプリケーション全体のロケールを変更したい場合、`useI18n()` を使用してグローバルロケールにアクセスできます。

以下はその例です：

```js
const i18n = createI18n({
  locale: 'ja', // set current locale
  messages: {
    en: {
      hello: 'hello!'
    },
    ja: {
      hello: 'こんにちは！'
    }
  },
  // vue-i18n something options here ...
  // ...
})

// create Vue app instance, install Vue I18n, and mount!
createApp(App).use(i18n).mount('#app')
```

コンポーネント：

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()
</script>

<template>
  <div class="locale-changer">
    <select v-model="locale">
      <option
        v-for="loc in availableLocales"
        :key="`locale-${loc}`"
        :value="loc"
      >
        {{ loc }}
      </option>
    </select>
  </div>
</template>
```

:::tip NOTE
テンプレートでは、グローバルインジェクションを介して `$i18n.locale` も利用可能です。`locale`、`fallbackLocale`、`availableLocales` にアクセスできます。`$i18n` プロパティの詳細については、[v12 破壊的変更](../migration/breaking12#drop-legacy-api-mode) を参照してください。
:::

上記の例では、`useI18n()` の `availableLocales` を使用して、利用可能なロケールを select 要素のオプションとしてリストしています。`locale` は書き込み可能な computed ref であるため、オプションを選択することで切り替えることができます。

ご覧のとおり、グローバルスコープは、アプリケーションのすべてのコンポーネントの UI に表示されるメッセージを一度に切り替えることができるため、非常に便利です。

### ローカルスコープ

ローカルスコープの `locale` は、デフォルトでグローバルスコープから継承されます。したがって、グローバルスコープで `locale` を変更すると、ローカルスコープの `locale` も変更されます。

アプリケーション全体のロケールを切り替えたい場合は、`createI18n` で作成された i18n インスタンスの `global` プロパティを介して変更する必要があります。

:::tip NOTE
グローバルスコープから `locale` を継承したくない場合は、`useI18n()` のオプションで `inheritLocale: false` を設定する必要があります。
:::

例：

```js
const i18n = createI18n({
  locale: 'ja', // set current locale
  // vue-i18n something options here ...
  // ...
})

// create Vue app instance, install Vue I18n, and mount!
createApp(App).use(i18n).mount('#app')

// change locale via `global` property
// i18n.global.locale is a ref, so set it via .value:
i18n.global.locale.value = 'en'
```

:::warning NOTICE
ローカルスコープの `locale` を変更しても、グローバルスコープの `locale` には影響しません。つまり、ローカルスコープコンポーネントでロケールを変更しても、アプリケーション全体のロケールは変更されません。グローバルロケールを変更するには、`useI18n({ useScope: 'global' })` を使用するか、`i18n.global.locale.value` にアクセスしてください。
:::
