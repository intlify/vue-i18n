# Nuxt 3 integration

We will introduce Vue I18n integration with Nuxt 3.

The following is a tutorial on setting up a Nuxt 3 application from the initial configuration.

:::warning NOTICE
This Nuxt3 application is set up in this tutorial doesn't support advanced i18n, such as URL (routing), SEO with `head` tag, and `lang` attribute in `html`tag.

Support for Nuxt 3 & Nuxt Bridge in [nuxtjs/i18n](https://i18n.nuxtjs.org/) is currently under development with Nuxt community.
You can check out the status of development and docs at [v8.i18n.nuxtjs.org](https://v8.i18n.nuxtjs.org/)

See the GitHub Discussion [here](https://github.com/nuxt-community/i18n-module/discussions/1287)
:::

If you go through this tutorial, you can learn how to integrate Vue I18n with Nuxt plugin.

## Requirements

Node.js requirement for this tutorial is the same environment as Nuxt 3.

Please check [here](https://nuxt.com/docs/getting-started/installation#prerequisites) for Node.js version of Nuxt 3.

## Example codes

You can get the code for the tutorial below on [examples/frameworks/nuxt3](https://github.com/intlify/vue-i18n-next/tree/master/examples/frameworks/nuxt3).

You can also see a deployed app made following this tutorial with a custom GitHub action to provide translations from DeepL in this [nuxt3-app-vue-i18n](https://github.com/lyqht/nuxt3-app-vue-i18n) project.

## Setup vue-i18n on Nuxt 3 Application

We will now set up the initial environment for using Vue I18n with Nuxt 3.

### Create Nuxt 3 application

Run the following command to create a Nuxt 3 application:

```sh
npx nuxi init nuxt3-app-vue-i18n
```

Once we have run the above command, the created Nuxt 3 initial project will have the following directory structure:

```
cd nuxt3-app-vue-i18n
tree -L 1
.
├── README.md
├── app.vue
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

### Install Vue I18n

Install Vue I18n with the following command:

```sh
npm install --save-dev vue-i18n
```

### Setup Nuxt plugin

Create a `plugins` directory as follows:

```sh
mkdir plugins
```

Next, create a Nuxt plugin file to set up Vue I18n.

```sh
touch plugins/i18n.ts
```

Once created, define the plugin as follows:

```ts
import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
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

Configuration of locale resources to localize a Nuxt 3 application is described in the [next section](#localize-your-nuxt-3-application)

### Run the Nuxt 3 application

Let's see if Vue I18n works with Nuxt 3.

We will edit `app.vue` of the setup Nuxt 3 application as follows:

```vue
<template>
  <div>
   <NuxtWelcome /> // [!code --]
   <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1> // [!code ++]
  </div>
</template>
```

We have edited and saved, run the following command to run the Nuxt 3 application in local:

```sh
npm run dev
```

Once the application is served on `http://localhost:3000`, we'll see the following:

![Nuxt3 setup](/nuxt3-setup.png)

## Localize your Nuxt 3 application

So far, we have been able to integrate Vue I18n into our Nuxt 3 application. Let's implement language switching and import locale resources from outside.

By implementing language switching we are effectively, i18n our Nuxt 3 application. 🌎 🌍 🌏

Also, when we separate the locale resources from the source code (externalizing them), we can use a separate workflow with the help of the Localization service in order to localize the app.

In the following sections, we will enable support for English, French, and Japanese on out Nuxt 3 app.

### Add language switching

We will add language switching feature to `app.vue` as follows:

```vue
<template>
  <div>
    <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
    <form> // [!code ++]
      <label for="locale-select">{{ $t('language') }}: </label> // [!code ++]
      <select id="locale-select" v-model="$i18n.locale"> // [!code ++]
        <option value="en">en</option> // [!code ++]
        <option value="fr">fr</option> // [!code ++]
        <option value="ja">ja</option> // [!code ++]
      </select> // [!code ++]
    </form> // [!code ++]
  </div>
</template>
```

Language switching is implemented using the `select` element on `form`.
The value of each option is defined as the value of the locale code, which will be explained later in the externalization of locale resources.

The value of each option defines the value of the locale code, which will be explained later in the externalization of locale resources.

### Externalize locale resources

We will define the locale resources as external.

There are several file formats for resources supported by Vue I18n, we'll opt for JSON in this particular case.

Let's create a non-"Nuxt-3-standard" directory named `locales` by running:

```sh
mkdir locales
```

Now, let's create the JSON files for each of the locales we want to support:

```sh
touch locales/en.json # for english
touch locales/fr.json # for french
touch locales/ja.json # for japanese
```

Let's populate them with the follwing:

For english at `locales/en.json`:

```json
{
  "hello": "Hello, {name}!",
  "language": "Language"
}
```

For french at `locales/fr.json`:

```json
{
  "hello": "Bonjour, {name}!",
  "language": "Langue"
}
```

For japanese at `locales/ja.json`:

```json
{
  "hello": "こんにちは、{name}！",
  "language": "言語"
}
```

### Import locale resources

Let's "register" the locales in our plugin (`plugins/i18n.ts`) as follows:

```js
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json' // [!code ++]
import fr from '../locales/fr.json' // [!code ++]
import ja from '../locales/ja.json' // [!code ++]

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
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

The `messages` option will be the one holding the local resources we register to it and being as fine-grained as we want. This granularity facilitates integration with the localization service.

Let's run `npm run dev` and head to `http://localhost:3000` to see if the changes so far work.

![Setup i18n on Nuxt3](/nuxt3-setup-i18n.gif)

The Nuxt 3 application is now ready for basic internationalization! 🎉

## Optimize with `@intlify/unplugin-vue-i18n`

So far, you have been able to use Vue I18n to support language switching on the Nuxt 3 application. Also, by externalizing the locale resources, you have separated them from the source code, making it easier to manage locale resources and integrate with the localization service.

However, as described in [Optimization](../advanced/optimization), the Nuxt 3 application prepared so far is sub-optimal in its bundle size.

Since Vue I18n v9, the message compiler allows pre-compiling of locale resources for improved performance, but has not yet been optimized for that performance.

Enter [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n), a Vue I18n to optimize performance.

### Install `@intlify/unplugin-vue-i18n`

```sh
npm install --save-dev @intlify/unplugin-vue-i18n
```

### Configure Nuxt config

Configure `nuxt.config.ts` like the below:

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

The bundler for Nuxt 3 is vite by default. So we will use the `vite` option here for optimization.

In `vite.plugins`, the plugin for `@intlify/unplugin-vue-i18n` is configured. As an option for this plugin, the `include` option specifies locale resources in json format placed in the `locales` directory. This allows `@intlify/unplugin-vue-i18n` to pre-compile locale resources at bundle time using Vue I18n message compiler internally. This improves the translation performance of Vue I18n and consequently the rendering performance of Nuxt 3 applications.

### Inside of bundling with optimization

Once finished with the setup, run `npm run dev` to check it out!

After accessing `http://localhost:3000`, the behavior of the Nuxt 3 application remains the same, but there is a change in the bandwidth of the Nuxt 3 application.

The following is a comparison of bundle sizes measured in the network tab of devtools with and without `@intlify/unplugin-vue-i18n`:

![Reduce bundle size](/nuxt3-reduce-bundle-size.png)

The area highlighted in blue is the code bundled by vite.

By setting up this plugin, the plugin will internally set up a Vue I18n module that is runtime-only. Specifically, vite config `resolve.alias`, set the `vue-i18n` alias to use only the Vue I18n runtime (`vue-i18n/dist/vue-i18n.runtime.esm-bundler.js`). This setting reduces the bundle size since the message compiler used by Vue I18n is not included.

About details, see `@intlify/unplugin-vue-i18n` [docs](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#runtimeonly)

Also, you can see the changes in the bundling of locale resources.

Code for locale resources, depending on whether or not the `@intlify/unplugin-vue-i18n` plugin to `vite.plugins` is set. Below:

![Pre-compile](/nuxt3-pre-compile.png)

Without the `@intlify/unplugin-vue-i18n` plugin to `vite.plugins`, locale resources are bundled as **json**, but with this plugin set, locale resources are **converted from json to JavaScript code** for bandwidth.

Vue I18n just call the functions since they have already been compiled.

In this guide, the Nuxt 3 application is small, so we can not enough experience the performance of the optimization but as the application gets larger, it will definitely benefit from it.
