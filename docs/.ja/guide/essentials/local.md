# ローカルスコープベースのローカライゼーション

## i18n コンポーネントオプション

[*スコープとロケールの変更*](scope)で示したように、Vue I18nには、グローバルスコープとローカルスコープという2つのスコープの概念があります。

一般的には、ロケール情報（`locale`, `messages`など）は`createI18n`のオプションとして設定され、`app.use`で設定（インストール）します。そして、グローバルスコープの翻訳関数`$t`と`$tc`を使ってローカライズします。

しかしある状況下では、ローカルメッセージのリソースを管理しながら、コンポーネントごとにローカライズする必要があります。この場合、グローバルスコープではなく、コンポーネントのi18nコンポーネントオプションを使って、各ローカルスコープをローカライズすると便利です。

以下は、ローカルスコープでのローカライゼーションの例です：

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

// コンポーネントの定義
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

```html
<div id="app">
  <h1>Root</h1>
  <p>{{ $t("message.hello") }}</p>
  <Component1 />
</div>
```

出力は以下のようになります：

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

上記の例のように、コンポーネントがロケールメッセージを持っていない場合、グローバルスコープにフォールバックします。[ここ](scope#ローカルスコープ-2)で説明したように、ローカルスコープの`locale`はグローバルスコープを継承しているため、コンポーネントはグローバルスコープで設定された言語を使用します（上の例では`locale： 'ja'`）。

また、[ここ](fallback#_1つのロケールによる明示的なフォールバック)で説明したように、デフォルトではグローバルスコープにフォールバックすると、コンソールに2つの警告が表示されることに注意してください。

```
[intlify] Not found 'message.greeting' key in 'ja' locale messages.
[intlify] Fall back to translate 'message.greeting' with root locale.
```

コンポーネントのロケールを使ってローカライズしたい場合は、`i18n`コンポーネントオプションで`sync: false`と`locale`を指定することで可能です。

## コンポーネントのロケールメッセージの共有

時に、グローバルスコープのロケールメッセージからフォールバックするのではなく、特定のコンポーネントに対して共有のロケールメッセージをインポートしたい場合があります（例：コンポーネントの特定の機能で共通のメッセージを使う場合）。

その場合、`i18n`の`sharedMessages`オプションが有効です。

共通のロケールメッセージの例：

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

```js
import commonMessage from './locales/common' // 共通ロケールメッセージのインポート

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

`messages`オプションと一緒に`sharedMessages`オプションが指定された場合、それらのメッセージはターゲットコンポーネントのVueI18nインスタンスにロケールメッセージとしてマージされます。
