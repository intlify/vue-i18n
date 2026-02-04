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

```typescript
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

```typescript
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

## カスタムディレクティブ `v-t` の廃止

**理由**: このカスタムディレクティブはすでに非推奨であり、v12 で削除されるという警告が表示されています。ドキュメントには次のように記載されています: https://vue-i18n.intlify.dev/guide/migration/breaking11.html#deprecate-custom-directive-v-t

## `MissingHandler` シグネチャの変更

**理由**: Vue 3.6+ では `getCurrentInstance()` API が非推奨になります。`MissingHandler` 型は以前、3 番目のパラメータとして `ComponentInternalInstance` を受け取っていましたが、これは使用できなくなりました。

### 以前 (v11)

```typescript
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

```typescript
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
