# ローカルスコープベースのローカリゼーション

## i18n コンポーネントオプション

[*「スコープとロケールの変更」*](scope) で説明したように、Vue I18n にはグローバルスコープとローカルスコープの 2 つのスコープ概念があります。

一般的に、ロケール情報（例：`locale`、`messages` など）は `createI18n` のオプションとして設定され、`app.use` で設定（インストール）されます。つまり、グローバルスコープの翻訳関数 `$t` を使用してそれらをローカライズします。

ローカルメッセージのリソースを管理しながら、コンポーネントごとにローカライズする必要がある場合があります。この場合、グローバルスコープの代わりにコンポーネントの `i18n` コンポーネントオプションを使用して、各ローカルスコープをローカライズすると便利です。

以下は、ローカルスコープベースのローカリゼーションの例です：

```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

// グローバルスコープで使用されるロケール情報をオプションとして設定
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

// コンポーネントを定義
const Component1 = {
  template: `
    <div id="component">
      <h1>Component1</h1>
      <p>Component1 locale messages: {{ $t("message.hello") }}</p>
      <p>Fallback global locale messages: {{ $t("message.greeting") }}</p>
    </div>
  `,
  i18n: {
    messages: {
      en: { message: { hello: 'hello component1' } },
      ja: { message: { hello: 'こんにちは、component1' } }
    }
  }
}

const app = createApp({
  components: { Component1 }
})
app.use(i18n)
app.mount('#app')
```

テンプレート：

<!-- eslint-skip -->

```html
<div id="app">
  <h1>Root</h1>
  <p>{{ $t("message.hello") }}</p>
  <Component1 />
</div>
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

上記の例のように、コンポーネントにロケールメッセージがない場合は、グローバルスコープにフォールバックします。[ここ](scope#local-scope-2) で説明したように、ローカルスコープの `locale` はグローバルスコープから継承するため、コンポーネントはグローバルスコープで設定された言語を使用します（上記の例では `locale: 'ja'`）。

また、[ここ](fallback#explicit-fallback-with-one-locale) で説明したように、デフォルトでは、グローバルスコープへのフォールバックによってコンソールに 2 つの警告が生成されることに注意してください：

```txt
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

コンポーネントのロケールを使用してローカライズしたい場合は、`i18n` コンポーネントオプションの `sync: false` と `locale` を使用して行うことができます。

## コンポーネント間でのロケールメッセージの共有

グローバルスコープのロケールメッセージからフォールバックするのではなく、特定のコンポーネント間で共有されるロケールメッセージをインポートしたい場合があります（例：コンポーネントの特定の機能の共通メッセージ）。

`i18n` の `sharedMessages` オプションを使用できます。

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

コンポーネント：

<!-- eslint-skip -->

```js
import commonMessage from './locales/common' // 共通ロケールメッセージをインポート

export default {
  name: 'ServiceModal',
  template: `
    <div class="modal">
      <div class="body">
        <p>This is good service</p>
      </div>
      <div class="footer">
        <button type="button">{{ $t('buttons.save') }}</button>
      </div>
    </div>
  `,
  i18n: {
    messages: { ... },
    sharedMessages: commonMessages
  }
}
```

`sharedMessages` オプションが `messages` オプションと一緒に指定された場合、それらのメッセージはターゲットコンポーネントの VueI18n インスタンスのロケールメッセージにマージされます。
