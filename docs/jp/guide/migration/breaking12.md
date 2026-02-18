# v12 破壊的変更

## Legacy API モードの廃止

**理由**: Legacy API モードは、[v11 破壊的変更](./breaking11.md#deprecate-legacy-api-mode)で発表されたように、v11 で非推奨になりました。これは、Vue 2 用の Vue I18n v8 と互換性のある API モードであり、v8 から v9 への移行をスムーズにするために提供されていました。

v12 では、Legacy API モードは完全に削除されました。`createI18n` の `legacy` オプションは使用できなくなり、すべてのアプリケーションは Composition API モードを使用する必要があります。

### 削除されたもの

- `createI18n` の `legacy: true` オプション
- `VueI18n` インスタンス（レガシーインターフェース）
- `VueI18nOptions` 型
- `allowComposition` オプション（Composition API が唯一のモードであるため不要）
- `VueI18n` インスタンスに依存していたレガシー固有の注入 API

### 以前 (v11)

```ts
import { createI18n } from 'vue-i18n'

// Legacy API モード
const i18n = createI18n({
  legacy: true, // 以前のバージョンではこれがデフォルトでした
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// VueI18n インスタンス経由のアクセス
i18n.global.locale = 'ja'
```

```html
<!-- Options API コンポーネント内 -->
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  mounted() {
    // this.$i18n (VueI18n インスタンス) 経由のアクセス
    console.log(this.$i18n.locale)
    this.$i18n.locale = 'ja'
  }
}
</script>
```

### 以後 (v12)

```ts
import { createI18n } from 'vue-i18n'

// Composition API モード (利用可能な唯一のモード)
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// Composer インスタンス経由のアクセス
i18n.global.locale.value = 'ja'
```

```html
<!-- Composition API の使用 -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// ロケールの変更
locale.value = 'ja'
</script>
```

```html
<!-- setup で useI18n を使用する Options API -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  }
}
</script>
```

### 移行

1. `createI18n` から `legacy: true` オプションを削除します
2. ロケールアクセスを `i18n.global.locale` から `i18n.global.locale.value` に変更します
3. setup 関数内の `this.$i18n` の使用を `useI18n()` に置き換えます
4. `this.$t()` を `useI18n()` の `t()` に置き換えます

詳細な移行ガイドについては、以下を参照してください。
- [Legacy API モードから Composition API モードへの移行](https://vue-i18n.intlify.dev/guide/migration/vue3.html)
- [Composition API の使用法](https://vue-i18n.intlify.dev/guide/advanced/composition.html)

### 詳細な移行ガイド

#### テンプレートでの `$t` / `$d` / `$n` の使用

v12 では、`globalInjection: true`（デフォルト）の場合、テンプレート内で `$t()`、`$d()`、`$n()`、`$rt()`、`$tm()`、`$te()` が引き続き利用可能です。これらは**グローバルスコープ**の Composer を参照します。コンポーネントローカルのスコープを使用するには、`useI18n()` の `t()` を使用してください。

```html
<!-- v12: テンプレートで $t は引き続き使用可能（グローバルスコープ） -->
<template>
  <p>{{ $t('hello') }}</p>
</template>
```

ただし、JavaScript コード（`methods`、`computed`、`watch`、ライフサイクルフック）内での `this.$t()` は使用できなくなりました。代わりに `setup()` 内で `useI18n()` を使用する必要があります。

**以前 (v11):**

```js
export default {
  methods: {
    greet() {
      return this.$t('hello')
    }
  },
  computed: {
    message() {
      return this.$t('welcome', { name: this.user })
    }
  },
  watch: {
    lang(val) {
      this.$i18n.locale = val
    }
  },
  mounted() {
    console.log(this.$t('ready'))
    console.log(this.$d(new Date(), 'long'))
    console.log(this.$n(1000, 'currency'))
  }
}
```

**以後 (v12) - `<script setup>`:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import { watch, onMounted, computed } from 'vue'

const { t, d, n, locale } = useI18n()

function greet() {
  return t('hello')
}

const message = computed(() => t('welcome', { name: user.value }))

watch(lang, (val) => {
  locale.value = val
})

onMounted(() => {
  console.log(t('ready'))
  console.log(d(new Date(), 'long'))
  console.log(n(1000, 'currency'))
})
</script>
```

**以後 (v12) - `setup()` を使用する Options API:**

```js
import { useI18n } from 'vue-i18n'
import { watch, onMounted, computed } from 'vue'

export default {
  setup() {
    const { t, d, n, locale } = useI18n()

    function greet() {
      return t('hello')
    }

    const message = computed(() => t('welcome', { name: user.value }))

    watch(lang, (val) => {
      locale.value = val
    })

    onMounted(() => {
      console.log(t('ready'))
      console.log(d(new Date(), 'long'))
      console.log(n(1000, 'currency'))
    })

    return { t, d, n, locale, greet, message }
  }
}
```

#### `$i18n` プロパティの変更

v11 では、`this.$i18n` はすべてのメソッドとプロパティにアクセスできる `VueI18n` インスタンスでした。v12 では、`$i18n` は `ExportedGlobalComposer` 型に変更され、以下のプロパティのみが公開されます。

| プロパティ | 型 | 説明 |
|---|---|---|
| `$i18n.locale` | `Locale` (string) | 現在のロケール（get/set） |
| `$i18n.fallbackLocale` | `FallbackLocale` | フォールバックロケール（get/set） |
| `$i18n.availableLocales` | `Locale[]` | 利用可能なロケール一覧（読み取り専用） |

`this.$i18n.t()`、`this.$i18n.setLocaleMessage()` などのメソッドは、`$i18n` 経由ではアクセスできなくなりました。代わりに `useI18n()` を使用してください。

**以前 (v11):**

```js
export default {
  mounted() {
    // VueI18n インスタンス - すべてのメソッドにアクセス可能
    this.$i18n.locale = 'ja'
    this.$i18n.setLocaleMessage('fr', { hello: 'Bonjour' })
    this.$i18n.mergeLocaleMessage('en', { goodbye: 'Goodbye' })
    console.log(this.$i18n.getLocaleMessage('en'))
    console.log(this.$i18n.t('hello'))
    console.log(this.$i18n.te('hello'))
    console.log(this.$i18n.tm('messages'))
    console.log(this.$i18n.d(new Date(), 'long'))
    console.log(this.$i18n.n(1000, 'currency'))
    this.$i18n.setDateTimeFormat('ja', { long: { /* ... */ } })
    this.$i18n.setNumberFormat('ja', { currency: { /* ... */ } })
    console.log(this.$i18n.silentTranslationWarn)
    console.log(this.$i18n.missing)
  }
}
```

**以後 (v12):**

```vue
<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const {
  locale,
  t, te, tm, d, n,
  setLocaleMessage, mergeLocaleMessage, getLocaleMessage,
  setDateTimeFormat, setNumberFormat,
  getMissingHandler
} = useI18n()

onMounted(() => {
  locale.value = 'ja'
  setLocaleMessage('fr', { hello: 'Bonjour' })
  mergeLocaleMessage('en', { goodbye: 'Goodbye' })
  console.log(getLocaleMessage('en'))
  console.log(t('hello'))
  console.log(te('hello'))
  console.log(tm('messages'))
  console.log(d(new Date(), 'long'))
  console.log(n(1000, 'currency'))
  setDateTimeFormat('ja', { long: { /* ... */ } })
  setNumberFormat('ja', { currency: { /* ... */ } })
  console.log(getMissingHandler())
})
</script>
```

#### コンポーネントローカルメッセージ

v11 では、`i18n` コンポーネントオプションでローカルメッセージを定義できました。v12 では、`i18n` コンポーネントオプションは `ComponentCustomOptions` から削除されました。

**以前 (v11):**

```js
export default {
  i18n: {
    messages: {
      en: { title: 'My Component' },
      ja: { title: 'マイコンポーネント' }
    }
  },
  template: '<h1>{{ $t("title") }}</h1>'
}
```

**以後 (v12) - `useI18n` で `useScope: 'local'` を使用:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local',
  messages: {
    en: { title: 'My Component' },
    ja: { title: 'マイコンポーネント' }
  }
})
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>
```

**以後 (v12) - SFC `<i18n>` カスタムブロックを使用:**

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1>{{ t('title') }}</h1>
</template>

<i18n>
{
  "en": { "title": "My Component" },
  "ja": { "title": "マイコンポーネント" }
}
</i18n>
```

`<i18n>` カスタムブロックが存在する場合、`useI18n()` は自動的にローカルスコープを使用します。

#### `createI18n` オプション名の変更

以下の表は、v11 Legacy API のオプション名と v12 Composition API の対応するオプション名のマッピングです。

| v11 (VueI18nOptions) | v12 (ComposerOptions) | 変更内容 |
|---|---|---|
| `legacy: true` | （削除） | Composition API のみ |
| `silentTranslationWarn` | `missingWarn` | 論理が反転（`true` → `false`、`false` → `true`） |
| `silentFallbackWarn` | `fallbackWarn` | 論理が反転 |
| `formatFallbackMessages` | `fallbackFormat` | 名前変更 |
| `warnHtmlInMessage` | `warnHtmlMessage` | 型変更: `'off'\|'warn'` → `boolean`（`'off'` → `false`、`'warn'` → `true`） |
| `escapeParameterHtml` | `escapeParameter` | 名前変更 |
| `sync` | `inheritLocale` | 名前変更 |
| `pluralizationRules` | `pluralRules` | 名前変更 |
| `sharedMessages` | （削除） | `messages` に直接マージして使用 |

**以前 (v11):**

```js
const i18n = createI18n({
  legacy: true,
  locale: 'en',
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  warnHtmlInMessage: 'off',
  escapeParameterHtml: true,
  sync: false,
  pluralizationRules: { ru: customRule },
  sharedMessages: { en: { shared: 'Shared' } },
  messages: { en: { hello: 'Hello' } }
})
```

**以後 (v12):**

```js
const i18n = createI18n({
  locale: 'en',
  missingWarn: false,          // silentTranslationWarn: true → missingWarn: false
  fallbackWarn: false,         // silentFallbackWarn: true → fallbackWarn: false
  fallbackFormat: true,        // formatFallbackMessages → fallbackFormat
  warnHtmlMessage: false,      // warnHtmlInMessage: 'off' → warnHtmlMessage: false
  escapeParameter: true,       // escapeParameterHtml → escapeParameter
  inheritLocale: false,        // sync → inheritLocale
  pluralRules: { ru: customRule },  // pluralizationRules → pluralRules
  messages: {
    en: {
      hello: 'Hello',
      shared: 'Shared'          // sharedMessages は messages に直接マージ
    }
  }
})
```

#### `VueI18n` インスタンスメソッド

v11 では、メッセージ管理は `VueI18n` インスタンス経由で行われていました。v12 では、`Composer` の同等のメソッドを使用します。

| VueI18n メソッド | Composer メソッド | 変更 |
|---|---|---|
| `t()` | `t()` | 同じ |
| `rt()` | `rt()` | 同じ |
| `te()` | `te()` | 同じ |
| `tm()` | `tm()` | 同じ |
| `d()` | `d()` | 同じ |
| `n()` | `n()` | 同じ |
| `getLocaleMessage()` | `getLocaleMessage()` | 同じ |
| `setLocaleMessage()` | `setLocaleMessage()` | 同じ |
| `mergeLocaleMessage()` | `mergeLocaleMessage()` | 同じ |
| `getDateTimeFormat()` | `getDateTimeFormat()` | 同じ |
| `setDateTimeFormat()` | `setDateTimeFormat()` | 同じ |
| `mergeDateTimeFormat()` | `mergeDateTimeFormat()` | 同じ |
| `getNumberFormat()` | `getNumberFormat()` | 同じ |
| `setNumberFormat()` | `setNumberFormat()` | 同じ |
| `mergeNumberFormat()` | `mergeNumberFormat()` | 同じ |
| `missing`（プロパティ） | `getMissingHandler()` / `setMissingHandler()` | プロパティ → メソッド |
| `postTranslation`（プロパティ） | `getPostTranslationHandler()` / `setPostTranslationHandler()` | プロパティ → メソッド |

**以前 (v11):**

```js
// createI18n で生成した i18n インスタンス経由
i18n.global.locale = 'ja'
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
i18n.global.missing = (locale, key) => { /* ... */ }
```

**以後 (v12):**

```js
// locale は Ref になったため .value が必要
i18n.global.locale.value = 'ja'
// メソッドは同名で利用可能
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
// missing はメソッド経由でアクセス
i18n.global.setMissingHandler((locale, key) => { /* ... */ })
```

#### `i18n.global` の変更

v11 Legacy API では、`i18n.global` は `VueI18n` インスタンスを返していました。v12 では、`Composer` インスタンスを返します。

主な違い:
- `i18n.global.locale` — `string` から `WritableComputedRef<string>` に変更（`.value` が必要）
- `i18n.global.fallbackLocale` — `WritableComputedRef` に変更（`.value` が必要）
- `i18n.global.messages` — `ComputedRef` に変更（`.value` が必要、読み取り専用）
- `i18n.global.availableLocales` — `ComputedRef` に変更（`.value` が必要、読み取り専用）


## カスタムディレクティブ `v-t` の廃止

**理由**: `v-t` カスタムディレクティブは v11 で非推奨となり、v12 で削除されるという警告が表示されていました。詳細は [v11 破壊的変更](./breaking11.md#deprecate-custom-directive-v-t) を参照してください。

すべての `v-t` ディレクティブの使用を `$t()`（グローバルスコープ）または `useI18n()` の `t()` に置き換えてください。

### 文字列構文

```html
<!-- 以前 (v11) -->
<p v-t="'hello'"></p>

<!-- 以後 (v12) -->
<p>{{ $t('hello') }}</p>
<!-- または useI18n() を使用 -->
<p>{{ t('hello') }}</p>
```

### オブジェクト構文（名前付き引数）

```html
<!-- 以前 (v11) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- 以後 (v12) -->
<p>{{ $t('hello', { name: userName }) }}</p>
```

### オブジェクト構文（複数形）

```html
<!-- 以前 (v11) -->
<p v-t="{ path: 'car', plural: count }"></p>
<!-- または -->
<p v-t="{ path: 'car', choice: count }"></p>

<!-- 以後 (v12) -->
<p>{{ $t('car', count) }}</p>
```

### オブジェクト構文（ロケール指定）

```html
<!-- 以前 (v11) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- 以後 (v12) -->
<p>{{ $t('hello', {}, { locale: 'ja' }) }}</p>
<!-- または useI18n() を使用 -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### eslint-plugin-vue-i18n による検出

`@intlify/vue-i18n/no-deprecated-v-t` ルールを使用して、コードベース内のすべての `v-t` の使用箇所を検出できます。

## `MissingHandler` シグネチャの変更

**理由**: Vue 3.6+ では `getCurrentInstance()` API が非推奨になります。`MissingHandler` 型は以前、3 番目のパラメータとして `ComponentInternalInstance` を受け取っていましたが、これは使用できなくなりました。

### 以前 (v11)

```ts
type MissingHandler = (
  locale: Locale,
  key: Path,
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, instance, type) => {
    // instance は ComponentInternalInstance でした
    console.warn(`Missing: ${key}`, instance?.uid)
  }
})
```

### 以後 (v12)

```ts
type MissingHandler = (
  locale: Locale,
  key: Path,
  uid?: number,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, uid, type) => {
    // uid は数値として直接渡されるようになりました
    console.warn(`Missing: ${key}`, uid)
  }
})
```

### 移行

`instance` パラメータを `uid` に置き換えます。

```diff
 const i18n = createI18n({
-  missing: (locale, key, instance, type) => {
-    console.warn(`Missing key "${key}" in ${locale}`, instance?.uid)
+  missing: (locale, key, uid, type) => {
+    console.warn(`Missing key "${key}" in ${locale}`, uid)
   }
 })
```
