# v12 重大变更

## 放弃传统 API 模式

**原因**: 传统 API 模式已在 v11 中弃用，正如 [v11 重大变更](./breaking11.md#deprecate-legacy-api-mode) 中所宣布的那样。它是与 Vue 2 的 Vue I18n v8 兼容的 API 模式，旨在平滑从 v8 到 v9 的迁移。

在 v12 中，传统 API 模式已被完全移除。`createI18n` 中的 `legacy` 选项不再可用，所有应用程序必须使用组合式 API 模式。

### 移除了什么

- `createI18n` 中的 `legacy: true` 选项
- `VueI18n` 实例（传统接口）
- `VueI18nOptions` 类型
- `allowComposition` 选项（不再需要，因为组合式 API 是唯一的模式）
- 依赖于 `VueI18n` 实例的特定于传统的注入 API

### 之前 (v11)

```ts
import { createI18n } from 'vue-i18n'

// 传统 API 模式
const i18n = createI18n({
  legacy: true, // 在早期版本中这是默认值
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// 通过 VueI18n 实例访问
i18n.global.locale = 'ja'
```

```html
<!-- 在选项式 API 组件中 -->
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  mounted() {
    // 通过 this.$i18n (VueI18n 实例) 访问
    console.log(this.$i18n.locale)
    this.$i18n.locale = 'ja'
  }
}
</script>
```

### 之后 (v12)

```ts
import { createI18n } from 'vue-i18n'

// 组合式 API 模式 (唯一可用模式)
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: { hello: 'Hello!' },
    ja: { hello: 'こんにちは！' }
  }
})

// 通过 Composer 实例访问
i18n.global.locale.value = 'ja'
```

```html
<!-- 使用组合式 API -->
<template>
  <p>{{ t('hello') }}</p>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 更改语言环境
locale.value = 'ja'
</script>
```

```html
<!-- 在 setup 中使用 useI18n 的选项式 API -->
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

### 迁移

1. 从 `createI18n` 中移除 `legacy: true` 选项
2. 将语言环境访问从 `i18n.global.locale` 更改为 `i18n.global.locale.value`
3. 在 setup 函数中将 `this.$i18n` 用法替换为 `useI18n()`
4. 将 `this.$t()` 替换为 `useI18n()` 中的 `t()`

有关详细的迁移指南，请参阅：
- [从传统 API 模式迁移到组合式 API 模式](https://vue-i18n.intlify.dev/guide/migration/vue3.html)
- [组合式 API 使用方法](https://vue-i18n.intlify.dev/guide/advanced/composition.html)

### 详细迁移指南

#### 模板中的 `$t` / `$d` / `$n` 用法

在 v12 中，当 `globalInjection: true`（默认值）时，`$t()`、`$d()`、`$n()`、`$rt()`、`$tm()`、`$te()` 在模板中仍然可用。它们引用**全局作用域**的 Composer。要使用组件局部作用域，请使用 `useI18n()` 的 `t()`。

```html
<!-- v12: $t 在模板中仍然可用（全局作用域） -->
<template>
  <p>{{ $t('hello') }}</p>
</template>
```

但是，JavaScript 代码（`methods`、`computed`、`watch`、生命周期钩子）中的 `this.$t()` 不再可用。您必须在 `setup()` 中使用 `useI18n()` 代替。

**之前 (v11):**

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

**之后 (v12) - `<script setup>`:**

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

**之后 (v12) - 使用 `setup()` 的选项式 API:**

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

#### `$i18n` 属性变更

在 v11 中，`this.$i18n` 是一个 `VueI18n` 实例，可以完全访问所有方法和属性。在 v12 中，`$i18n` 更改为 `ExportedGlobalComposer` 类型，仅公开以下属性：

| 属性 | 类型 | 描述 |
|---|---|---|
| `$i18n.locale` | `Locale` (string) | 当前语言环境（get/set） |
| `$i18n.fallbackLocale` | `FallbackLocale` | 回退语言环境（get/set） |
| `$i18n.availableLocales` | `Locale[]` | 可用语言环境列表（只读） |

`this.$i18n.t()`、`this.$i18n.setLocaleMessage()` 等方法不再可通过 `$i18n` 访问。请改用 `useI18n()`。

**之前 (v11):**

```js
export default {
  mounted() {
    // VueI18n 实例 - 可以完全访问所有方法
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

**之后 (v12):**

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

#### 组件局部消息

在 v11 中，`i18n` 组件选项允许定义局部消息。在 v12 中，`i18n` 组件选项已从 `ComponentCustomOptions` 中移除。

**之前 (v11):**

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

**之后 (v12) - 使用 `useI18n` 配合 `useScope: 'local'`:**

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

**之后 (v12) - 使用 SFC `<i18n>` 自定义块:**

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

当存在 `<i18n>` 自定义块时，`useI18n()` 会自动使用局部作用域。

#### `createI18n` 选项名称变更

下表将 v11 传统 API 选项名称映射到其 v12 组合式 API 对应项：

| v11 (VueI18nOptions) | v12 (ComposerOptions) | 变更 |
|---|---|---|
| `legacy: true` | （已移除） | 仅组合式 API |
| `silentTranslationWarn` | `missingWarn` | 逻辑反转（`true` → `false`，`false` → `true`） |
| `silentFallbackWarn` | `fallbackWarn` | 逻辑反转 |
| `formatFallbackMessages` | `fallbackFormat` | 重命名 |
| `warnHtmlInMessage` | `warnHtmlMessage` | 类型变更: `'off'\|'warn'` → `boolean`（`'off'` → `false`，`'warn'` → `true`） |
| `escapeParameterHtml` | `escapeParameter` | 重命名 |
| `sync` | `inheritLocale` | 重命名 |
| `pluralizationRules` | `pluralRules` | 重命名 |
| `sharedMessages` | （已移除） | 直接合并到 `messages` 中 |

**之前 (v11):**

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

**之后 (v12):**

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
      shared: 'Shared'          // sharedMessages 直接合并到 messages 中
    }
  }
})
```

#### `VueI18n` 实例方法

在 v11 中，消息管理通过 `VueI18n` 实例完成。在 v12 中，使用 `Composer` 上的等效方法：

| VueI18n 方法 | Composer 方法 | 变更 |
|---|---|---|
| `t()` | `t()` | 相同 |
| `rt()` | `rt()` | 相同 |
| `te()` | `te()` | 相同 |
| `tm()` | `tm()` | 相同 |
| `d()` | `d()` | 相同 |
| `n()` | `n()` | 相同 |
| `getLocaleMessage()` | `getLocaleMessage()` | 相同 |
| `setLocaleMessage()` | `setLocaleMessage()` | 相同 |
| `mergeLocaleMessage()` | `mergeLocaleMessage()` | 相同 |
| `getDateTimeFormat()` | `getDateTimeFormat()` | 相同 |
| `setDateTimeFormat()` | `setDateTimeFormat()` | 相同 |
| `mergeDateTimeFormat()` | `mergeDateTimeFormat()` | 相同 |
| `getNumberFormat()` | `getNumberFormat()` | 相同 |
| `setNumberFormat()` | `setNumberFormat()` | 相同 |
| `mergeNumberFormat()` | `mergeNumberFormat()` | 相同 |
| `missing`（属性） | `getMissingHandler()` / `setMissingHandler()` | 属性 → 方法 |
| `postTranslation`（属性） | `getPostTranslationHandler()` / `setPostTranslationHandler()` | 属性 → 方法 |

**之前 (v11):**

```js
// 通过 createI18n 创建的 i18n 实例访问
i18n.global.locale = 'ja'
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
i18n.global.missing = (locale, key) => { /* ... */ }
```

**之后 (v12):**

```js
// locale 现在是 Ref，因此需要 .value
i18n.global.locale.value = 'ja'
// 方法使用相同名称
i18n.global.setLocaleMessage('fr', { hello: 'Bonjour' })
// missing 现在通过方法访问
i18n.global.setMissingHandler((locale, key) => { /* ... */ })
```

#### `i18n.global` 变更

在 v11 传统 API 中，`i18n.global` 返回一个 `VueI18n` 实例。在 v12 中，它返回一个 `Composer` 实例。

主要区别：
- `i18n.global.locale` — 从 `string` 更改为 `WritableComputedRef<string>`（需要 `.value`）
- `i18n.global.fallbackLocale` — 更改为 `WritableComputedRef`（需要 `.value`）
- `i18n.global.messages` — 更改为 `ComputedRef`（需要 `.value`，只读）
- `i18n.global.availableLocales` — 更改为 `ComputedRef`（需要 `.value`，只读）


## 放弃自定义指令 `v-t`

**原因**: `v-t` 自定义指令已在 v11 中弃用，并警告将在 v12 中删除。详情请参阅 [v11 重大变更](./breaking11.md#deprecate-custom-directive-v-t)。

将所有 `v-t` 指令用法替换为 `$t()`（全局作用域）或 `useI18n()` 的 `t()`。

### 字符串语法

```html
<!-- 之前 (v11) -->
<p v-t="'hello'"></p>

<!-- 之后 (v12) -->
<p>{{ $t('hello') }}</p>
<!-- 或使用 useI18n() -->
<p>{{ t('hello') }}</p>
```

### 对象语法（命名参数）

```html
<!-- 之前 (v11) -->
<p v-t="{ path: 'hello', args: { name: userName } }"></p>

<!-- 之后 (v12) -->
<p>{{ $t('hello', { name: userName }) }}</p>
```

### 对象语法（复数形式）

```html
<!-- 之前 (v11) -->
<p v-t="{ path: 'car', plural: count }"></p>
<!-- 或 -->
<p v-t="{ path: 'car', choice: count }"></p>

<!-- 之后 (v12) -->
<p>{{ $t('car', count) }}</p>
```

### 对象语法（语言环境覆盖）

```html
<!-- 之前 (v11) -->
<p v-t="{ path: 'hello', locale: 'ja' }"></p>

<!-- 之后 (v12) -->
<p>{{ $t('hello', {}, { locale: 'ja' }) }}</p>
<!-- 或使用 useI18n() -->
<p>{{ t('hello', {}, { locale: 'ja' }) }}</p>
```

### 使用 eslint-plugin-vue-i18n 检测

您可以使用 `@intlify/vue-i18n/no-deprecated-v-t` 规则来检测代码库中所有的 `v-t` 用法。

## 默认复数形式现在使用 `Intl.PluralRules`

**原因**: 以前的默认复数形式规则是一个简单的仅适用于英语的实现，无法正确处理具有复杂复数类别的语言（例如俄语、阿拉伯语、波兰语）。Vue I18n v12 现在使用 `Intl.PluralRules` 根据当前语言环境自动选择正确的复数形式。

### 变更内容

- 当语言环境没有设置自定义 `pluralRules` 时，Vue I18n 自动使用 `Intl.PluralRules` 来确定正确的复数类别（zero、one、two、few、many、other）
- 消息的各种形式必须按照 CLDR 复数类别顺序排列：`zero | one | two | few | many | other`（仅包含该语言环境中存在的类别）
- 如果消息的形式数量超过语言环境的复数类别数量，Vue I18n 将回退到之前的默认规则
- 如果运行时环境中没有 `Intl.PluralRules`，Vue I18n 将回退到之前的默认规则

### 迁移

如果您在**没有**自定义 `pluralRules` 的情况下依赖非英语语言环境的之前默认规则，您需要重新排列消息的形式以匹配该语言环境的 CLDR 复数类别顺序。

**之前 (v11) — 带自定义 `pluralRules` 的俄语：**

无需更改。自定义 `pluralRules` 优先，并继续像以前一样工作。

**之后 (v12) — 俄语（自动，无需自定义 `pluralRules`）：**

```js
const i18n = createI18n({
  locale: 'ru',
  // 不需要 pluralRules — Intl.PluralRules 自动处理
  messages: {
    ru: {
      // 顺序：one | few | many | other（俄语的 CLDR 顺序）
      car: '{n} машина | {n} машины | {n} машин | {n} машин'
    }
  }
})
```

## 更改 `MissingHandler` 签名

**原因**: Vue 3.6+ 弃用了 `getCurrentInstance()` API。`MissingHandler` 类型以前接收 `ComponentInternalInstance` 作为第三个参数，但这不再可用。

### 之前 (v11)

```ts
type MissingHandler = (
  locale: Locale,
  key: Path,
  instance?: ComponentInternalInstance,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, instance, type) => {
    // instance 是 ComponentInternalInstance
    console.warn(`Missing: ${key}`, instance?.uid)
  }
})
```

### 之后 (v12)

```ts
type MissingHandler = (
  locale: Locale,
  key: Path,
  uid?: number,
  type?: string
) => string | void

const i18n = createI18n({
  missing: (locale, key, uid, type) => {
    // uid 现在直接作为数字传递
    console.warn(`Missing: ${key}`, uid)
  }
})
```

### 迁移

将 `instance` 参数替换为 `uid`：

```diff
 const i18n = createI18n({
-  missing: (locale, key, instance, type) => {
-    console.warn(`Missing key "${key}" in ${locale}`, instance?.uid)
+  missing: (locale, key, uid, type) => {
+    console.warn(`Missing key "${key}" in ${locale}`, uid)
   }
 })
```
