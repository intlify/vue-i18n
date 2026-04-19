# 从 Vue 2 迁移

## `vue-i18n-bridge`

:::danger 注意
由于 Vue 2 EOL，v10 将不再提供 vue-i18n-bridge。v9.13 将是最后一个版本。
:::

### 什么是 `vue-i18n-bridge`?

`vue-i18n-bridge` 是一个桥梁，旨在使 vue-i18n@v8.26.1 或更高版本与 vue-i18n@v9.x 之间的升级尽可能简单。

它可以用于你已经使用 vue-i18n@v8.26.1 或更高版本构建的 Vue 2 应用程序中。

并且，一些特性也从 vue-i18n@v9.x 向后移植：

- Vue I18n 组合式 API，由 `@vue/composition-api` 和 `vue-demi` 提供支持
- 消息格式语法，由 `@intlify/message-compiler` 提供支持

### 安装

#### 包管理器

::: code-group

```sh [npm]
npm install vue-i18n-bridge
```

```sh [yarn]
yarn add vue-i18n-bridge
```

```sh [pnpm]
pnpm add vue-i18n-bridge
```

:::

在使用此库之前，必须安装以下包：

- vue-i18n: >= v8.26.1 < v9
- vue-demi: >= v0.13.5
- @vue/composition-api: >= v1.2.0 (如果你使用的是 Vue 2.6)

#### CDN

**对于 Vue 2.7**:

在 `vue`、`vue-demi` 之后引入 `vue-i18n-bridge`，它将自动安装。

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.7"></script>
<script src="https://unpkg.com/vue-i18n@8/dist/vue-i18n.min.js"></script>
<script src="https://unpkg.com/vue-demi@0.13.5/lib/index.iife.js"></script>
<script src="https://unpkg.com/vue-i18n-bridge@9.2.0-beta.38/dist/vue-i18n-bridge.global.prod.js"></script>
```

**对于 Vue 2.6**:

在 `vue`、`@vue/composition-api`、`vue-demi` 之后引入 `vue-i18n-bridge`，它将自动安装。

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
<script src="https://unpkg.com/vue-i18n@8/dist/vue-i18n.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.4"></script>
<script src="https://unpkg.com/vue-demi@0.13.5/lib/index.iife.js"></script>
<script src="https://unpkg.com/vue-i18n-bridge@9.2.0-beta.38/dist/vue-i18n-bridge.global.prod.js"></script>
```

### 用法

#### 组合式 API

**对于 Vue 2.7**:

```js
import Vue from 'vue'
import { createApp } from 'vue-demi'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueI18n, { bridge: true }) // 安装 vue-i18n 时必须指定 '{ bridge: true }' 插件选项

// `createI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` 提供的 `createI18n` 有第二个参数，你**必须**传递 `vue-i18n` 提供的 `VueI18n` 构造函数

const app = createApp({
 setup() {
   // `useI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
   const { t, locale } = useI18n()
   // ... 做点什么

   return { t, locale }
 }
})

app.use(i18n) // 你必须安装由 `createI18n` 创建的 `i18n` 实例
app.mount('#app')
```

**对于 Vue 2.6**:

```js
import Vue from 'vue'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // 安装 vue-i18n 时必须指定 '{ bridge: true }' 插件选项

// `createI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` 提供的 `createI18n` 有第二个参数，你**必须**传递 `vue-i18n` 提供的 `VueI18n` 构造函数

const app = createApp({
 setup() {
   // `useI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
   const { t, locale } = useI18n()
   // ... 做点什么

   return { t, locale }
 }
})

app.use(i18n) // 你必须安装由 `createI18n` 创建的 `i18n` 实例
app.mount('#app')
```

#### 传统 API

**对于 Vue 2.7**:

<!-- eslint-skip -->

```js
import Vue from 'vue'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueI18n, { bridge: true }) // 安装 vue-i18n 时必须指定 '{ bridge: true }' 插件选项

// `createI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` 提供的 `createI18n` 有第二个参数，你**必须**传递 `vue-i18n` 提供的 `VueI18n` 构造函数

Vue.use(i18n) // 你必须安装由 `createI18n` 创建的 `i18n` 实例

const app = new Vue({ i18n })
app.$mount('#app')
```

**对于 Vue 2.6**:

<!-- eslint-skip -->

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true }) // 安装 vue-i18n 时必须指定 '{ bridge: true }' 插件选项

// `createI18n` 选项几乎与 vue-i18n (vue-i18n@v9.x) API 相同
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n) // `vue-i18n-bridge` 提供的 `createI18n` 有第二个参数，你**必须**传递 `vue-i18n` 提供的 `VueI18n` 构造函数

Vue.use(i18n) // 你必须安装由 `createI18n` 创建的 `i18n` 实例

const app = new Vue({ i18n })
app.$mount('#app')
```

**对于 TypeScript:**

<!-- eslint-skip -->

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { createI18n, useI18n, castToVueI18n } from 'vue-i18n-bridge'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

// 你需要转换 `i18n` 实例
const i18n = castToVueI18n(createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        hello: 'hello, {name}!'
      }
    },
    ja: {
      message: {
        hello: 'こんにちは、{name}！'
      }
    }
  }
}, VueI18n))

Vue.use(i18n)

const app = new Vue({ i18n })
app.$mount('#app')
```

### 在浏览器中使用 UMD 模块

#### 对于 Vue 2.7
```js
const { createApp } = VueDemi // 导出的 UMD 命名为 `VueDemi`
const { createI18n, useI18n } = VueI18nBridge // 导出的 UMD 命名为 `VueI18nBridge`

Vue.use(VueI18n, { bridge: true })

const i18n = createI18n({
  locale: 'ja',
  messages: {
    // ...
  }
}, VueI18n)

const app = createApp({}, {
  // ...
})
app.use(i18n)
app.mount('#app') // Vue 应用宿主容器元素
```

#### 对于 Vue 2.6
```js
const { createApp } = VueCompositionAPI // 导出的 UMD 命名为 `VueCompositionAPI`
const { createI18n, useI18n } = VueI18nBridge // 导出的 UMD 命名为 `VueI18nBridge`

Vue.use(VueCompositionAPI)
Vue.use(VueI18n, { bridge: true })

const i18n = createI18n({
  locale: 'ja',
  messages: {
    // ...
  }
}, VueI18n)

const app = createApp({}, {
  // ...
})
app.use(i18n)
app.mount('#app') // Vue 应用宿主容器元素
```

### 限制
- 在传统 API 模式下，你**不能使用从 `vue-i18n` 移植的[新消息格式语法](https://vue-i18n.intlify.dev/guide/essentials/syntax.html)**
  - 它仅在组合式 API 模式下可用
- 在传统 API 模式下，你**不能使用从 `vue-i18n` 移植的以下向后移植组件**
  - 翻译组件: `<i18n-t>`
  - 日期时间格式组件: `<i18n-d>`
  - 数字格式组件: `<i18n-n>`
- 在组合式 API 模式下，以下以 `$` 为前缀的 API 是**全局作用域**
  - `$t`
  - `$d`
  - `$n`

### 不同构建版本的说明
在 [npm 包的 dist/ 目录](https://unpkg.com/browse/vue-i18n-bridge@9.2.0-beta.6/dist/) 中，你会发现许多不同的 `vue-i18n-bridge` 构建版本。以下是根据用例应使用哪个 dist 文件的概述。

#### 从 CDN 或不使用打包器

- **`vue-i18n-bridge(.runtime).global(.prod).js`**:
  - 用于通过浏览器中的 `<script src="...">` 直接使用。暴露 `VueI18nBridge` 全局变量
  - 浏览器内消息格式编译：
    - `vue-i18n-bridge.global.js` 是包含编译器和运行时的“完整”构建，因此它支持动态编译消息格式
    - `vue-i18n-bridge.runtime.global.js` 仅包含运行时，并且需要在构建步骤中预编译消息格式
  - 内联所有 Vue I18n 核心内部包 - 即它是一个不依赖于其他文件的单个文件。这意味着你**必须**从该文件导入所有内容，并且仅从该文件导入，以确保获得相同的代码实例
  - 包含硬编码的 prod/dev 分支，prod 构建已预压缩。生产环境请使用 `*.prod.js` 文件

:::warning 注意
全局构建不是 [UMD](https://github.com/umdjs/umd) 构建。它们构建为 [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)，仅用于通过 `<script src="...">` 直接使用。
:::

- **`vue-i18n-bridge(.runtime).esm-browser(.prod).js`**:
  - 用于通过原生 ES 模块导入使用（在浏览器中通过 `<script type="module">`）
  - 与全局构建共享相同的运行时编译、依赖项内联和硬编码的 prod/dev 行为

#### 使用打包器

- **`vue-i18n-bridge(.runtime).esm-bundler.js`**:
  - 用于与 `webpack`、`rollup` 和 `parcel` 等打包器一起使用
  - 保留带有 `process.env`<wbr/>`.NODE_ENV` 守卫的 prod/dev 分支（必须由打包器替换）
  - 不提供压缩构建（在打包后与其余代码一起完成）
  - 导入依赖项（例如 `@intlify/core-base`、`@intlify/message-compiler`）
    - 导入的依赖项也是 `esm-bundler` 构建，并将依次导入它们的依赖项（例如 `@intlify/message-compiler` 导入 `@intlify/shared`）
    - 这意味着你**可以**单独安装/导入这些依赖项，而不会得到这些依赖项的不同实例，但你必须确保它们都解析为相同的版本
  - 浏览器内本地化消息编译：
    - **`vue-i18n-bridge.runtime.esm-bundler.js`** 仅限运行时，并且需要预编译所有本地化消息。这是打包器的默认入口（通过 `package.json` 中的 `module` 字段），因为在使用打包器时，模板通常是预编译的（例如在 `*.json` 文件中）
    - **`vue-i18n-bridge.esm-bundler.js` (默认)**: 包含运行时编译器。如果你使用打包器但仍希望进行本地化消息编译（例如通过内联 JavaScript 字符串的模板），请使用此选项。要使用此构建，请将你的导入语句更改为：`import { createI18n } from "vue-i18n-bridge/dist/vue-i18n-bridge.esm-bundler.js";`

:::warning 注意
如果你使用 `vue-i18n-bridge.runtime.esm-bundler.js`，你将需要预编译所有本地化消息，你可以使用 `.json` (`.json5`) 或 `.yaml`、i18n 自定义块来管理 i18n 资源。因此，你打算使用打包器和以下加载器/插件预编译所有本地化消息。

- [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
:::

#### 对于 Node.js (服务端)

- **`vue-i18n-bridge.cjs(.prod).js`**:
  - 用于在 Node.js 中通过 `require()` 使用
  - 如果你使用 `webpack` 打包你的应用程序并设置 `target: 'node'` 并正确外部化 `vue-i18n-bridge`，这就是将被加载的构建
  - dev/prod 文件是预构建的，但会根据 `process.env`<wbr/>`.NODE_ENV` 自动 require 适当的文件

## `vue-i18n-composable`

Vue 3 开始支持组合式 API，你可以使用官方的 [`@vue/composition-api`](https://github.com/vuejs/composition-api) 插件使组合式 API 在 Vue 2 中可用。

Vue I18n 组合式 API 也可以在 Vue 2 中使用 `vue-i18n-composable` 插件使用。

关于如何使用，请参见 [这里](https://github.com/intlify/vue-i18n-composable)

:::warning 注意
`vue-i18n-composable` 允许 Vue I18n v8.x 的主要 API 与组合式 API 一起工作。Vue I18n v9 中提供的所有组合式 API 都不可用。
:::
