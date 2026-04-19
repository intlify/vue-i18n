# v9 破壊的変更

Vue I18n v9（Vue 3用）で提供されるAPIの多くは、v8（Vue 2用）からの移行を容易にするために互換性を維持するよう努めています。しかし、アプリケーションを移行する際に遭遇する可能性のある破壊的変更がいくつかあります。このガイドは、アプリケーションをVue I18n v9で動作するように適応させる方法について説明します。

## API

### `new VueI18n` が `createI18n` になりました

Vue I18nはクラスではなく、一連の関数になりました。`new VueI18n()`と書く代わりに、`createI18n`を呼び出す必要があります。

Vue I18n v8.x:

```js{2,4,6-8,11}
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
  // ...
})

new Vue({
  i18n,
  // ...
})
```

Vue I18n v9 以降:

```js{2,4-6,11}
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // ...
})

const app = createApp({
  // ...
})
app.use(i18n)
```

**理由**: Vue 3の[グローバルAPIの変更](https://v3-migration.vuejs.org/breaking-changes/global-api.html)、およびコンポーネントインスタンスに関連するVue 3のAPIアーキテクチャの変更のため。

### `dateTimeFormats` から `datetimeFormats` へのリネーム

Vue I18n v8.x:

```js{3-5}
const i18n = new VueI18n({
  // ...
  dateTimeFormats: {
    // ...
  }
})
```

Vue I18n v9 以降:

```js{3-5}
const i18n = createI18n({
  // ...
  datetimeFormats: {
    // ...
  }
})
```

### 翻訳APIの戻り値

`$t`や`t`のような翻訳API関数は**文字列**のみを返します。オブジェクトや配列の値は返されなくなりました。

Vue I18n v8.x:

```js{24}
// 例: 配列構造のロケールメッセージ
const i18n = new VueI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// 例: エラーコンポーネント
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ getErrorMessage(code) }}</p>`,
  methods: {
    getErrorMessage(code) {
      return this.$t('errors')[code]
    }
  }
}
```

Vue I18n v9以降では、`$tm` / `tm`でロケールメッセージを取得し、`$rt`または`rt`でロケールメッセージを解決するように変更されました。以下のComposition APIの例をご覧ください。

```js{24}
// 例: 配列構造のロケールメッセージ
const i18n = createI18n({
  messages: {
    en: {
      errors: [
        'invalid argument',
        // ...
        'unexpected errors'
      ]
    }
  }
})

// 例: エラーコンポーネント
const ErrorMessage = {
  props: {
    code: {
      type: Number,
      required: true
    }
  },
  template: `<p class="error">{{ errors(code) }}</p>`,
  setup() {
    const { tm, rt } = useI18n()
    const errors = (code) => rt(tm('errors')[code])
    return { errors }
  }
}
```

**理由**: 翻訳結果を返す**義務を単純化**するため、またTypeScriptの型をサポートするため。

### 複数形APIの戻り値

*[翻訳APIの戻り値](#翻訳apiの戻り値)*と同様に、`$tc`や`tc`のような複数形API関数は**文字列**のみを返します。オブジェクトや配列の値は返されなくなりました。

**理由**: 翻訳結果を返す**義務を単純化**するため、またTypeScriptの型をサポートするため。

### `getChoiceIndex` の削除

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `getChoiceIndex`オプションの実装コードはv10で完全に削除される予定です。

<!-- eslint-enable markdown/no-missing-label-refs -->

複数形ルールをカスタマイズするために、Vue I18n v8.xではVueI18nクラスの`getChoiceIndex`を拡張していました。

Vue I18n v8.x:

```js
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  // this === VueI18n インスタンスなので、locale プロパティが存在します
  if (this.locale !== 'ru') {
    // デフォルトの実装に進む
  }

  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }
  return (choicesLength < 4) ? 2 : 3;
}
```

Vue I18n v9以降では、以下のオプションでカスタマイズできます。

Legacy APIモード:

```js{21-24}
import { createI18n } from 'vue-i18n'

function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const i18n = createI18n({
  // ...
  pluralizationRules: {
    ru: customRule,
    // ...
  },
  // ...
})
```

Composition APIモード:

```js{23-26}
import { useI18n } from 'vue-i18n'

function customRule(choice, choicesLength, orgRule) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

const MyComp = {
  setup() {
    const { t } = useI18n({
      // ...
      pluralRules: {
        ru: customRule,
        // ...
      },
      // ...
    })

    // ...
  }
}
```

**理由**: VueI18nクラスが削除されたため。

### `warnHtmlInMessage` オプションのデフォルト値の変更

Vue I18n v8.xでは、`warnHtmlInMessage`の値は`"off"`でした。そのため、デフォルトでは、メッセージにHTMLが含まれていてもコンソールに警告は出力されません。

Vue I18n v9以降では、デフォルト値が以下のように変更されました。

- Legacy APIモード: `warnHtmlInMessage` プロパティ: `"warn"`
- Composition APIモード: `warnHtmlMessage` boolean プロパティ、デフォルト `true`

開発モードでは、この値を変更しない限り、**デフォルトでコンソールに警告が表示されます**。

本番モードでは、パフォーマンスを最大化するために、メッセージにHTMLが含まれているかどうかを検出しません。

**理由**: ロケールメッセージのセキュリティを強化するため。

### バージョン情報

バージョン情報は、VueI18nクラスの静的プロパティではなく、インポート構文でアクセスできるようになりました。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.version)
```

Vue I18n v9 以降:

```js
import { VERSION } from 'vue-i18n'

console.log(VERSION)
```

**理由**: Tree shakingの最適化、およびVueI18nクラスの削除のため。

### Intl availability の削除

主要なブラウザが[ECMAScript Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)をサポートするようになったため、削除されました。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

console.log(VueI18n.availability)
```

**理由**: IE9のサポート終了、およびVueI18nクラスの削除のため。

### Custom formatter の削除

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `formatter`オプションの実装コードはv10で完全に削除される予定です。
> 代替として、vue-i18nは実験的機能として[カスタムメッセージフォーマット](../advanced/format.md)を持っています。

<!-- eslint-enable markdown/no-missing-label-refs -->

**理由**: 新しいコンパイラとランタイムAPIでカスタムフォーマットを提供することが困難なため。これらのAPIでサポートするために、次のメジャーバージョンでサポートする予定です。ICUメッセージフォーマットを使用したい場合は、[@formatjs/vue-intl](https://formatjs.io/docs/vue-intl/)を使用できます。

### `preserveDirectiveContent` オプションの削除

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `preserveDirectiveContent`オプションの実装コードはv10で完全に削除される予定です。

<!-- eslint-enable markdown/no-missing-label-refs -->

Vue 3用の`v-t`ディレクティブは、デフォルトのコンテンツを保持するようになりました。したがって、このオプションとそのプロパティはVueI18nインスタンスから削除されました。

Vue I18n v8.x:

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  preserveDirectiveContent: true,
  // ...
})
```

**理由**: `v-t`ディレクティブを持つ要素のコンテンツを維持するため。

## メッセージフォーマット構文

### リスト補間のための配列風オブジェクトの削除

Vue I18n v8.xでは、リスト補間は次のような配列風オブジェクトをパラメータとして使用できました。

<!-- eslint-skip -->

```js
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  // ...
  messages: {
    en: {
      greeting: 'hello, {0}!'
    }
  },
  // ...
})
```

```html
<p>{{ $t('greeting', { '0': 'kazupon' }) }}</p>
```

Vue I18n v9以降では、リスト補間に配列風オブジェクトを使用することはできず、配列を使用する必要があります。

```html
<p>{{ $t('greeting', ['kazupon']) }}</p>
```

**理由**: 一貫した引数インターフェースを持つ翻訳APIを提供するため。

### 特殊文字の処理

Vue I18nで翻訳できるメッセージは、次のようなメッセージフォーマット構文を使用して高度に翻訳できます。

```txt
@.caml:{'no apples'} | {0} apple | {n}　apples
```

メッセージフォーマット構文は、以下の特殊文字を使用して表現できます。

- `{`, `}`, `@`, `$`, `|`

Vue I18n v9以降、メッセージフォーマット構文はメッセージフォーマットコンパイラによって処理されるようになりました。メッセージの一部としてこれらの特殊文字を使用すると、コンパイル時にエラーが発生します。これらの特殊文字を使用したい場合は、**リテラル補間を使用する必要があります**。

```txt
// 例: メールアドレスでの `@` のユースケース
{emailIdentity}{'@'}{emailDomain}
```

**理由**: メッセージフォーマットコンパイラがメッセージフォーマット構文で使用される特殊文字を正しく処理するためには、それらを制限する必要があります。

### リンクメッセージの括弧によるグループ化の削除

Vue I18n v8.xでは、リンクメッセージ内のキー参照と、括弧 `()` を使用したメッセージの区別が行われていました。

Vue I18n v8.x:

```js{5}
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: 'There\'s a reason, you lost, @:(message.dio).'
    }
  }
}
```

Vue I18n v9以降では、メッセージフォーマットコンパイラが**名前付き補間、リスト補間、リテラル補間**を処理できるため、括弧は不要になりました。

Vue I18n v9 以降:

```js
const messages = {
  en: {
    message: {
      dio: 'DIO',
      linked: "There's a reason, you lost, @:{'message.dio'}."
    }
  }
}
```

## `v-t` ディレクティブ

### `preserve` 修飾子の削除

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!CAUTION]
> `preserve`修飾子の実装コードはv10で完全に削除される予定です。

<!-- eslint-enable markdown/no-missing-label-refs -->

*[preserveDirectiveContent オプションの削除](#preservedirectivecontent-オプションの削除)*と同様に、Vue 3用の`v-t`ディレクティブはデフォルトのコンテンツを保持するようになりました。したがって、`preserve`修飾子とその関連機能は`v-t`ディレクティブから削除されました。

Vue I18n v8.x:

```html
<p v-t.preserve="'hello'"></p>
```

**理由**: `v-t`ディレクティブを持つ要素のコンテンツを維持するため。

## 翻訳コンポーネント

### `i18n` から `i18n-t` へのリネーム

翻訳コンポーネント（Vue I18n v8.xでは *i18n関数型コンポーネント* と呼ばれていました）のタグ名が変更されました。

Vue I18n v8.x:

<!-- eslint-skip -->

```html
<i18n path="message.greeting" />
```

Vue I18n v9 以降:

<!-- eslint-skip -->

```html
<i18n-t keypath="message.greeting" />
```

**理由**: タグ名がi18nカスタムブロック `<i18n>` と同じであるため、ブロック名と混同しやすく、SFCで間違いを犯しやすいため。

### `tag` prop は任意

Vue I18n v8.xでは、タグ名と`Boolean`値 `false` を指定することで、ルート要素なしで子要素をレンダリングするために `tag` prop を使用できました。

Vue I18n v8.x:

```html{1,3}
<i18n :tag="false" path="message.greeting">
  <span>hello!</span>
</i18n>
```

Vue I18n v9以降では、`tag` propを省略することで同じことができます。

Vue I18n v9 以降:

```html{1,3}
<i18n-t keypath="message.greeting">
  <span>hello!</span>
</i18n-t>
```

**理由**: Vue 3がFragmentsをサポートするようになったため。

### `path` prop から `keypath` prop へのリネーム

Vue I18n v8.x:

<!-- eslint-skip -->

```html
<i18n path="message.greeting" />
```

Vue I18n v9 以降:

<!-- eslint-skip -->

```html
<i18n-t keypath="message.greeting" />
```

### `place` 属性と `places` prop を使用した place 構文の削除

Vue I18n v9以降では、`place`属性と`places` propはコンポーネント補間から削除されました。

Vue I18n v8.x:

```html
<i18n path="info" tag="p" :places="{ limit: refundLimit }">
  <span place="limit">{{ refundLimit }}</span>
  <a place="action" :href="refundUrl">{{ $t('refund') }}</a>
</i18n>
```

Vue I18n v9 以降:

<!-- eslint-skip -->

```html
<i18n-t keypath="info" tag="p">
  <template #limit>
    <span>{{ refundLimit }}</span>
  <template>
  <template #action>
    <a :href="refundUrl">{{ $t('refund') }}</a>
  <template>
</i18n-t>
```

**理由**: slotsを使って同じことができるため。

## NumberFormat コンポーネント

### `tag` prop は任意

*[翻訳コンポーネントのセクション](#tag-prop-は任意)*と同様に、NumberFormatコンポーネント（Vue I18n v8.xでは *i18n-n関数型コンポーネント* と呼ばれていました）では、タグ名と`Boolean`値 `false` を指定することで、ルート要素なしで子要素をレンダリングするために `tag` prop を使用できました。

Vue I18n v8.x:

```html
<i18n-n :tag="false" :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

Vue I18n v9以降では、`tag` propを省略することで同じことができます。

Vue I18n v9 以降:

```html
<i18n-n :value="100" format="currency">
  <span v-slot:integer="slotProps" styles="font-weight: bold">{{ slotProps.integer }}</span>
</i18n-n>
```

**理由**: Vue 3がFragmentsをサポートするようになったため。
