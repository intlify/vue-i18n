# Nuxt 集成

我们建议使用 [Nuxt I18n (@nuxtjs/i18n)](https://i18n.nuxtjs.org/) 来将 Vue I18n 与 Nuxt 一起使用，它具有高级功能，如本地化路由、SEO 标签等。

## 创建你自己的 Nuxt 集成

以下是一个关于如何通过 Nuxt 插件添加 Vue I18n 来设置具有你自己集成的 Nuxt 应用程序的教程。

:::warning 注意
本集成教程不支持高级 i18n 功能（如路由和 SEO 标签），仅用于演示目的，请考虑使用 Nuxt I18n 模块，并在 [i18n.nuxtjs.org](https://i18n.nuxtjs.org/) 查看其文档以获取更多详细信息。
:::

## 要求

本教程的 Node.js 要求与 Nuxt 相同环境。

请检查 [这里](https://nuxt.com/docs/getting-started/installation#prerequisites) 以获取 Nuxt 的 Node.js 版本。

## 示例代码

你可以在 [examples/frameworks/nuxt3](https://github.com/intlify/vue-i18n/tree/master/examples/frameworks/nuxt3) 上获取下面教程的代码。

你还可以在这个 [nuxt3-app-vue-i18n](https://github.com/lyqht/nuxt3-app-vue-i18n) 项目中看到按照本教程制作的已部署应用程序，其中包含一个自定义 GitHub 操作，用于从 DeepL 提供翻译。

## 在 Nuxt 应用程序上设置 vue-i18n

我们现在将设置在 Nuxt 中使用 Vue I18n 的初始环境。

### 创建 Nuxt 应用程序

运行以下命令以创建 Nuxt 应用程序：

::: code-group

```sh [npx]
npx nuxi init nuxt3-app-vue-i18n
```

```sh [pnpm]
pnpm dlx nuxi init nuxt3-app-vue-i18n
```

:::


运行上述命令后，创建的 Nuxt 初始项目将具有以下目录结构：

```txt
cd nuxt3-app-vue-i18n
tree -L 1
.
├── README.md
├── app.vue
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### 安装 Vue I18n

使用以下命令安装 Vue I18n：

::: code-group

```sh [npm]
npm install vue-i18n -D
```

```sh [yarn]
yarn add vue-i18n -D
```

```sh [pnpm]
pnpm add -D vue-i18n
```

:::

### 设置 Nuxt 插件

创建一个 `plugins` 目录如下：

```sh
mkdir plugins
```

接下来，创建一个 Nuxt 插件文件来设置 Vue I18n。

```sh
touch plugins/i18n.ts
```

创建后，定义插件如下：

```ts
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    globalInjection: true,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, {name}!'
      }
    }
  })

  vueApp.use(i18n)
})
```

本地化 Nuxt 应用程序的语言环境资源配置在 [下一节](#本地化你的-nuxt-应用程序) 中描述

### 运行 Nuxt 应用程序

让我们看看 Vue I18n 是否与 Nuxt 一起工作。

我们将如下编辑设置的 Nuxt 应用程序的 `app.vue`：

```vue
<template>
  <div>
    <NuxtWelcome /> // [!code --]
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1> // [!code ++]
  </div>
</template>
```

我们已经编辑并保存，运行以下命令在本地运行 Nuxt 应用程序：

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

:::


一旦应用程序在 `http://localhost:3000` 上提供服务，我们将看到以下内容：

![Nuxt3 setup](/nuxt3-setup.png)

## 本地化你的 Nuxt 应用程序

到目前为止，我们已经能够将 Vue I18n 集成到我们的 Nuxt 应用程序中。让我们实现语言切换并从外部导入语言环境资源。

通过实现语言切换，我们有效地对 Nuxt 应用程序进行了 i18n。 🌎 🌍 🌏

此外，当我们将语言环境资源与源代码分离（外部化）时，我们可以在本地化服务的帮助下使用单独的工作流程来本地化应用程序。

在以下部分中，我们将启用对英语、法语和日语的支持。

### 添加语言切换

我们将如下向 `app.vue` 添加语言切换功能：

```vue
<template>
  <div>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
    <form>
      // [!code ++]
      <label for="locale-select">{{ $t('language') }}: </label> // [!code ++]
      <select
        id="locale-select"
        v-model="$i18n.locale"
      >
        // [!code ++]
        <option value="en">
          en
        </option> // [!code ++]
        <option value="fr">
          fr
        </option> // [!code ++]
        <option value="ja">
          ja
        </option> // [!code ++]
      </select> // [!code ++]
    </form> // [!code ++]
  </div>
</template>
```

语言切换是使用 `form` 上的 `select` 元素实现的。
每个选项的值定义为语言环境代码的值，这将在稍后的语言环境资源外部化中解释。

每个选项的值定义了语言环境代码的值，这将在稍后的语言环境资源外部化中解释。

### 外部化语言环境资源

我们将把语言环境资源定义为外部资源。

Vue I18n 支持多种资源文件格式，在这种情况下我们将选择 JSON。

让我们通过运行以下命令创建一个名为 `locales` 的非“Nuxt-3-标准”目录：

```sh
mkdir locales
```

现在，让我们为我们要支持的每个语言环境创建 JSON 文件：

```sh
touch locales/en.json # 英语
touch locales/fr.json # 法语
touch locales/ja.json # 日语
```

让我们用以下内容填充它们：

英语 `locales/en.json`:

```json
{
  "hello": "Hello, {name}!",
  "language": "Language"
}
```

法语 `locales/fr.json`:

```json
{
  "hello": "Bonjour, {name}!",
  "language": "Langue"
}
```

日语 `locales/ja.json`:

```json
{
  "hello": "こんにちは、{name}！",
  "language": "言語"
}
```

### 导入语言环境资源

让我们在我们的插件 (`plugins/i18n.ts`) 中“注册”语言环境，如下所示：

<!-- eslint-skip -->

```js
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json' // [!code ++]
import fr from '../locales/fr.json' // [!code ++]
import ja from '../locales/ja.json' // [!code ++]

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    globalInjection: true,
    locale: 'en',
    messages: {
      en: { // [!code --]
        hello: "Hello, {name}!" // [!code --]
      } // [!code --]
      en, // [!code ++]
      fr, // [!code ++]
      ja // [!code ++]
    }
  })

  vueApp.use(i18n)
})
```

`messages` 选项将包含我们注册到它的本地资源，并且可以根据我们的需要进行细粒度控制。这种粒度有助于与本地化服务集成。

让我们运行 `npm run dev`（或 `yarn dev` 或 `pnpm dev`）并前往 `http://localhost:3000` 看看目前的更改是否有效。

![Setup i18n on Nuxt3](/nuxt3-setup-i18n.gif)

Nuxt 应用程序现在已准备好进行基本的国际化！ 🎉

## 使用 `@intlify/unplugin-vue-i18n` 进行优化

到目前为止，你已经能够使用 Vue I18n 在 Nuxt 应用程序上支持语言切换。此外，通过外部化语言环境资源，你已将它们与源代码分离，从而更容易管理语言环境资源并与本地化服务集成。

但是，如 [优化](../advanced/optimization) 中所述，到目前为止准备的 Nuxt 应用程序在其包大小方面是次优的。

自 Vue I18n v9 以来，消息编译器允许预编译语言环境资源以提高性能，但尚未针对该性能进行优化。

进入 [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)，这是一个用于优化性能的 Vue I18n。

### 安装 `@intlify/unplugin-vue-i18n`

::: code-group

```sh [npm]
npm install @intlify/unplugin-vue-i18n -D
```

```sh [yarn]
yarn add @intlify/unplugin-vue-i18n -D
```

```sh [pnpm]
pnpm add -D @intlify/unplugin-vue-i18n
```

:::

### 配置 Nuxt 配置

如下配置 `nuxt.config.ts`：

<!-- eslint-skip -->

```js
import { defineNuxtConfig } from 'nuxt'
import { resolve, dirname } from 'node:path' // [!code ++]
import { fileURLToPath } from 'url' // [!code ++]
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite' // [!code ++]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: { // [!code ++]
    transpile: ['vue-i18n'] // [!code ++]
  }, // [!code ++]
  vite: { // [!code ++]
    plugins: [ // [!code ++]
      VueI18nVitePlugin({ // [!code ++]
        include: [ // [!code ++]
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json') // [!code ++]
        ] // [!code ++]
      }) // [!code ++]
    ] // [!code ++]
  } // [!code ++]
})
```

Nuxt 的默认打包器是 vite。所以我们将在这里使用 `vite` 选项进行优化。

在 `vite.plugins` 中，配置了 `@intlify/unplugin-vue-i18n` 的插件。作为此插件的一个选项，`include` 选项指定放置在 `locales` 目录中的 json 格式的语言环境资源。这允许 `@intlify/unplugin-vue-i18n` 在打包时在内部使用 Vue I18n 消息编译器预编译语言环境资源。这提高了 Vue I18n 的翻译性能，从而提高了 Nuxt 应用程序的渲染性能。

### 优化打包内部

完成设置后，运行 `npm run dev` 来查看！

访问 `http://localhost:3000` 后，Nuxt 应用程序的行为保持不变，但 Nuxt 应用程序的带宽发生了变化。

以下是在 devtools 的网络选项卡中测量的有和没有 `@intlify/unplugin-vue-i18n` 的包大小比较：

![Reduce bundle size](/nuxt3-reduce-bundle-size.png)

蓝色突出显示的区域是 vite 打包的代码。

通过设置此插件，插件将在内部设置一个仅运行时的 Vue I18n 模块。具体来说，vite config `resolve.alias`，设置 `vue-i18n` 别名以仅使用 Vue I18n 运行时 (`vue-i18n/dist/vue-i18n.runtime.esm-bundler.js`)。此设置减少了包大小，因为不包括 Vue I18n 使用的消息编译器。

有关详细信息，请参阅 `@intlify/unplugin-vue-i18n` [文档](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#runtimeonly)

此外，你可以看到语言环境资源打包的变化。

语言环境资源的代码，取决于是否设置了 `vite.plugins` 的 `@intlify/unplugin-vue-i18n` 插件。如下：

![Pre-compile](/nuxt3-pre-compile.png)

如果没有 `vite.plugins` 的 `@intlify/unplugin-vue-i18n` 插件，语言环境资源将被打包为 **json**，但是设置了此插件后，语言环境资源将从 json **转换为 JavaScript 代码** 以用于带宽。

Vue I18n 只是调用这些函数，因为它们已经被编译了。

在本指南中，Nuxt 应用程序很小，因此我们无法充分体验优化的性能，但随着应用程序变大，它肯定会从中受益。
