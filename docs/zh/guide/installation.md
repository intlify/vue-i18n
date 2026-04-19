# 安装

## 环境要求

- Vue.js `3.0.0`+

## 包管理器

::: code-group

```sh [npm]
npm install vue-i18n@11
```

```sh [yarn]
yarn add vue-i18n@11
```

```sh [pnpm]
pnpm add vue-i18n@11
```

:::

使用模块系统时，必须通过 `app.use()` 显式安装 `vue-i18n`：


```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  // vue-i18n 的相关配置 ...
})

const app = createApp({
  // vue 的相关配置
})

app.use(i18n)
app.mount('#app')
```


## 直接下载

<https://unpkg.com/vue-i18n@11>

[unpkg.com](https://unpkg.com) 提供基于 npm 的 CDN 链接。上述链接始终指向 npm 上的最新版本。

### 全局引入

```html
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-i18n@11"></script>
```

您还可以通过 URL 来使用特定版本/标签，例如 <https://unpkg.com/vue-i18n@11.0.0/dist/vue-i18n.global.js>

### ES Modules 引入

```html
<script type="module" src="https://unpkg.com/vue@3/dist/vue.esm-browser.js">
<script type="module" src="https://unpkg.com/vue-i18n@11/dist/vue-i18n.esm-browser.js">
```

您还可以通过 URL 来使用特定版本/标签，例如 <https://unpkg.com/vue-i18n@11.0.0/dist/vue-i18n.esm-browser.js>

