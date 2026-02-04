# Vue I18n 的小型子集

`petite-vue-i18n` 是 Vue I18n 的替代发行版，它仅提供最小的功能。

## 与 Vue I18n 有什么区别？

- 大小比 vue-i18n 小
  - CDN 或无打包器
    - 包减少大小：运行时 + 编译器 `~32%`，仅运行时 `~45%`
    - `petite-vue-i18n`：运行时 + 编译器 `~9.61KB`，仅运行时 `~5.51KB`（生产构建，brotli 压缩）
    - `vue-i18n`：运行时 + 编译器 `~14.18KB`，仅运行时 `~10.12KB`（生产构建，brotli 压缩）
  - 浏览器的 ES 模块
    - 包减少大小：运行时 + 编译器 `~32%`，仅运行时 `~45%`
    - `petite-vue-i18n`：运行时 + 编译器 `~10.51KB`，仅运行时 `~6.20KB`（生产构建，brotli 压缩）
    - `vue-i18n`：运行时 + 编译器 `~15.40KB`，仅运行时 `~11.12KB`（生产构建，brotli 压缩）
  - 应用程序包大小
    - 从 `vue-i18n` 减少的大小：`~10%`（[vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-vue-i18n) 和 [petite-vue-i18n](https://github.com/intlify/vue-i18n/tree/master/packages/size-check-petite-vue-i18n) 的代码大小检查测量）
- 不支持传统 API，**仅支持组合式 API**
- 不包含以下日期时间格式、数字格式和实用程序的 API。**仅翻译**
  - `n`, `$n`
  - `d`, `$d`
  - `rt`, `$rt`
  - `tm`, `$tm`
  - `getDateTimeFormat`, `setDateTimeFormat`, `mergeDateTimeFormat`
  - `getNumberFormat`, `setNumberFormat`, `mergeNumberFormat`
- **唯一可以处理的语言环境消息是简单的键值对**。如果你可以处理分层的语言环境消息，你需要使用 API 自定义它们
- 本地回退的算法是 `fallbackLocale` 中指定的 **数组顺序**
- 不包含自定义指令 `v-t`
- 不包含 `vue-i18n` 提供的以下组件
  - Translation `i18n-t`
  - DatetimeFormat `i18n-d`
  - NumberFormat `i18n-n`

## `petite-vue-i18n` 的用例

`vue-i18n` 包含各种 i18n 功能，例如翻译、日期时间格式和数字格式。有些项目可能只使用翻译而不使用日期时间格式。目前，即使在这种情况下，也会包含该功能的代码。

如果你的项目仅使用 `t` 或 `$t` API 进行翻译，那么我们建议你使用 `petite-vue-i18n` 而不是 `vue-i18n`。如果你的项目需要 `vue-i18n` 的功能，你可以顺利地从 `petite-vue-i18n` 迁移到 `vue-i18n`。这意味着它是渐进式增强。

## 安装

基本上，它与安装 `vue-i18n` 相同。唯一的区别是 URL 的一部分或路径的一部分从 `vue-i18n` 更改为 `petite-vue-i18n`。

### CDN
你需要将以下脚本插入到 `<head>` 的末尾：

```html
<script src="https://unpkg.com/vue@next"></script>
<script src="https://unpkg.com/petite-vue-i18n"></script>
```

以下是带有 script 标签的应用程序代码：

```html
<script>
const { createApp } = Vue
const { createI18n } = PetiteVueI18n

const i18n = createI18n({
  // vue-i18n 一些选项 ...
})

const app = createApp({
  // vue 一些选项 ...
})

app.use(i18n)
app.mount('#app')
</script>
```

### 包管理器

::: code-group

```sh [npm]
npm install petite-vue-i18n@next --save
```

```sh [yarn]
yarn add petite-vue-i18n@next
```

```sh [pnpm]
pnpm add petite-vue-i18n@next
```
:::


```js
import { createApp } from 'vue'
import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  // vue-i18n 一些选项 ...
})

const app = createApp({
  // vue 一些选项 ...
})

app.use(i18n)
app.mount('#app')
```

## 用法

### Hello world

模板：
```html
<div id="app">
  <h1>{{ t('hello world') }}</h1>
</div>
```

脚本：
```js
const { createApp } = Vue
const { createI18n, useI18n } = PetiteVueI18n
// 或者对于 ES 模块
// import { createApp } from 'vue'
// import { createI18n } from 'petite-vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      'hello world': 'Hello world!'
    },
    ja: {
      'hello world': 'こんにちは、世界！'
    }
  }
})

// 定义 App 组件
const App = {
  setup() {
    const { t } = useI18n()
    return { t }
  }
}

const app = createApp(App)

app.use(i18n)
app.mount('#app')
```

### 使用与 `vue-i18n` 相同的消息解析器和语言环境回退器

在 `petite-vue-i18n` 中，消息解析器和语言环境回退器使用简单的实现来优化代码大小，如 [差异部分](https://github.com/intlify/vue-i18n/tree/master/packages/petite-vue-i18n#question-what-is-the-difference-from-vue-i18n-) 中所述，如下所示：

- 消息解析器
  - 解析键值风格的语言环境消息
  - 关于实现，请参阅 [这里](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/resolver.ts#L305-L307)
- 语言环境回退器
  - 根据 `fallbackLocale` 中指定的数组顺序回退
  - 如果指定了简单的字符串语言环境，则回退到该语言环境
  - 关于实现，请参阅 [这里](https://github.com/intlify/vue-i18n/blob/2d4d2a342f8bae134665a0b7cd945fb8b638839a/packages/core-base/src/fallbacker.ts#L40-L58)

如果你想使用与 `vue-i18n` 相同的消息解析器和语言环境回退器，你可以使用 API 更改它们。

请注意，目前仅支持 vite 和 webpack 等打包器。

你需要使用包管理器将 `@intlify/core-base` 安装到你的项目中。

::: code-group

```sh [npm]
npm install --save @intlify/core-base@next
```

```sh [yarn]
yarn add @intlify/core-base@next
```

```sh [pnpm]
pnpm add @intlify/core-base@next
```
:::

然后，在应用程序的入口点，使用 API 配置消息解析器和语言环境回退器，如下所示：

<!-- eslint-skip -->

```js
import { createApp } from 'vue'
import {
  createI18n,
  registerMessageResolver, // 注册消息解析器 API
  registerLocaleFallbacker, // 注册语言环境回退器 API
} from 'petite-vue-i18n'
import {
  resolveValue, // 默认使用的 vue-i18n 消息解析器
  fallbackWithLocaleChain // 默认使用的 vue-i18n 语言环境回退器
} from '@intlify/core-base'

// 注册 vue-i18n 的消息解析器
registerMessageResolver(resolveValue)

// 注册 vue-i18n 的语言环境回退器
registerLocaleFallbacker(fallbackWithLocaleChain)

// 一些代码 ...
// ...
```

通过上述设置，语言环境消息解析和语言环境回退将以与 vue-i18n 相同的方式处理，请注意代码大小会略有增加。

### 设置打包器插件

如果你正在使用 vite 等构建工具链构建应用程序，则必须对其进行配置。
请如下设置 [`@intlify/unplugin-vue-i18n` 中的 'module' 选项](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#module) 配置。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!NOTE]
> 关于 `@intlify/unplugin-vue-i18n` 设置，请参阅 ['性能' 部分](./optimization.md) 和 [`@intlify/unplugin-vue-i18n` 文档](https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md)

> [!IMPORTANT]
> `@intlify/unplugin-vue-i18n` 版本必须为 **5.1.0 及更高版本**

<!-- eslint-enable markdown/no-missing-label-refs -->

```diff
 // vite.config.ts
 import { defineConfig } from 'vite'
 import { resolve, dirname } from 'node:path'
 import { fileURLToPath } from 'url'
 import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

 export default defineConfig({
   /* ... */
   plugins: [
     /* ... */
     VueI18nPlugin({
       /* options */
+      module: 'petite-vue-i18n',
       // locale messages resource pre-compile option
       include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
     }),
   ],
 })
```

### 在不更改导入 id 的情况下切换

你可以使用 npm 别名在应用程序中从 vue-i18n 切换到 petite-vue-i18n，而无需更改导入 id。

package.json:
```diff
 {
   // ...
   "dependencies": {
     "vue": "^3.4.14",
-     "vue-i18n": "^10.0.0"
+     "vue-i18n": "npm:petite-vue-i18n@^10.0.0"
   },
 }
```

你需要 `@intlify/unplugin-vue-i18n` 来构建你的应用程序。
