# Nuxt 3 integration

We will introduce Vue I18n integration for Nuxt 3.

The following is a tutorial on setting up a Nuxt 3 application from the initial configuration.

If you go through this tutorial, you can learn how to integrate Vue I18n with Nuxt plugin.

## Requirements

The Node.js requirement for this tutorial is the same environment as Nuxt 3.

Please check [here](https://v3.nuxtjs.org/getting-started/quick-start#prerequisites) for Node.js version of Nuxt 3.

## Example codes

You can get the code for the tutorial below on [examples/frameworks/nuxt3](https://github.com/intlify/vue-i18n-next/tree/master/examples/framework/nuxt3).

## Setup vue-i18n on Nuxt 3 Application

We will now set up the initial environment for using Vue I18n with Nuxt 3.

### Create Nuxt 3 application

Run the following command to create a Nuxt 3 application:

```sh
npx nuxi init nuxt3-app-vue-i18n
```

We will have run the above command, it will be created  Nuxt 3 initial project with the following directory structure:

```
cd nuxt3-app-vue-i18n
tree -L 1
.
├── README.md
├── app.vue
├── node_modules
├── nuxt.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

### Install Vue I18n

Install Vue I18n with the following command:

```sh
npm install --save-dev vue-i18n
```

### Setup Nuxt plugin

We will set up the Nuxt plugin.

Create a `plugins` directory as follows:

```sh
mkdir plugins
```

Next, create a Nuxt plugin file to implement for setting up Vue I18n.

```sh
touch plugins/i18n.ts
```

When we have created it, edit it with the below codes:

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

We aim to set up Vue I18n in the implementation here.

Configure up locale resources to localize a Nuxt 3 application is described in the next section.

### Run the Nuxt 3 application

Let's see if Vue I18n works with Nuxt 3.

We will edit `app.vue` of the setup Nuxt 3 application as follows:

```diff
 <template>
   <div>
-   <NuxtWelcome />
+   <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
   </div>
 </template>
```

We have edited and saved, run the following command to run the Nuxt 3 application at local:

```sh
npm run dev
```

After we will run the command and access to `http://localhost:3000`, you can see the display similar to the following:

![Nuxt3 setup](/nuxt3-setup.png)

## Localize your Nuxt 3 application

So far we have been able to integrate Vue I18n into our Nuxt 3 application.
Next, we will implement language switching and import locale resources from outside.

By implementing language switching, we can i18n our Nuxt 3 application. Also, when we will be separating locale resources from the source code and externalizing them, we can be localized in a separate workflow using the Localization service.

In the following sections, we will work on Nuxt 3 applications that support English, French, and Japanese.

### Add language switching

We will add language switching feature to `app.vue` as follows:

```diff
 <template>
   <div>
     <h1>{{ $t('hello', { name: 'vue-i18n' }) }}</h1>
+    <form>
+      <label for="locale-select">{{ $t('language') }}: </label>
+      <select id="locale-select" v-model="$i18n.locale">
+        <option value="en">en</option>
+        <option value="fr">fr</option>
+        <option value="ja">ja</option>
+      </select>
+    </form>
+  </div>
 </template>
```

Language switching is implemented using the select element on form.
The value of each option is defined as the value of the locale code, which will be explained later in the externalization of locale resources.

The value of each option defines the value of the locale code, which will be explained later in the externalization of locale resources.

### Externalize locale resources

We will define the locale resources as externalizing.

There are several file formats for resources supported by Vue I18n, so we will use the json format in here.

These are managed separately from the directories managed by Nuxt 3 by creating `locales` directories as follows:

```sh
mkdir locales
```

Then, We will have created a file defining locale resources for English, French, and Japanese as follows:

```sh
touch locales/en.json # for english
touch locales/fr.json # for french
touch locales/ja.json # for japanese
```

And more then, We will have saved each created locale resource file for each language as follows:

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

We will import locale resources that is defined in the `locales` directory for use with Vue I18n.

And then, change `plugins/i18n.ts` as follows:

```diff
 import { createI18n } from 'vue-i18n'
+import en from '../locales/en.json'
+import fr from '../locales/fr.json'
+import ja from '../locales/ja.json'
 
 export default defineNuxtPlugin(({ vueApp }) => {
   const i18n = createI18n({
     legacy: false,
     globalInjection: true,
     locale: 'en',
-    messages: {
-      en: {
-        hello: "Hello, {name}!"
-      }
+      en,
+      fr,
+      ja
     }
   })
 
   vueApp.use(i18n)
 })
```

It’s set locale resources for each imported language to `messages` option, so you can manage locale resources with separating from code in the `locales` directory. It also facilitates integration with the localization service.

Let's run `npm run dev` to see if the fixes so far work. When we will have run the command and have be access to `http://localhost:3000`, you can see the display similar to the following:

![Setup i18n on Nuxt3](/nuxt3-setup-i18n.gif)

Your Nuxt 3 application is now ready for basic internationalization!

## Optimize with `@intlify/unplugin-vue-i18n`

So far, you have been able to use Vue I18n to support language switching for your Nuxt 3 application. Also, by externalizing the locale resoruces, you have separated them from the code, making it easier to manage locale resources and integrate with the localization service.

However, as described in the [Optimization](../advanced/optimization), your Nuxt 3 application prepared so far is not optimized for bundle size.

Since Vue I18n v9, the message compiler allows pre-compiling of locale resources for improved performance, but has not yet been optimized for that performance.

Finally, we would to introduce with you [@intlify/unplugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) a Vue I18n to optimize performance.

### Install `@intlify/unplugin-vue-i18n`

```sh
npm install --save-dev @intlify/unplugin-vue-i18n
```

### Configure Nuxt config

Configure `nuxt.config.ts` like the below:

```diff
 import { defineNuxtConfig } from 'nuxt'
+import { resolve, dirname } from 'node:path'
+import { fileURLToPath } from 'url'
+import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
 
 // https://v3.nuxtjs.org/api/configuration/nuxt.config
 export default defineNuxtConfig({
+  vite: {
+    resolve: {
+      alias: {
+        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
+      }
+    },
+    plugins: [
+      VueI18nVitePlugin({
+        include: [
+          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
+        ]
+      })
+    ]
+  }
 })
```

The bundler for Nuxt 3 is vite by default. So we will use the `vite` option here for optimization.

In `vite.resolve.alias`, set the `vue-i18n` alias to use only the Vue I18n runtime (`vue-i18n/dist/vue-i18n.runtime.esm-bundler.js`). This setting reduces the bundle size since the message compiler used by Vue I18n is not included.

In `vite.plugins`, the plugin for `@intlify/unplugin-vue-i18n` is configured. As an option for this plugin, the `include` option specifies locale resources in json format placed in the `locales` directory. This allows `@intlify/unplugin-vue-i18n` to pre-compile locale resources at bundle time using Vue I18n message compiler internally. This improves the translation performance of Vue I18n and consequently the rendering performance of Nuxt 3 applications.

### Inside of bundling with optimization

When you have finished the setup, let’s run `npm run dev` to check it out!

When you will access to `http://localhost:3000`, the behavior of the Nuxt 3 application remains the same, but there is a change in the bandwidth of the Nuxt 3 application.

The following is a comparison of bundle sizes measured in the network tab of devtools with and without `vite.resolve.alias`:

![Reduce bundle size](/nuxt3-reduce-bundle-size.png)

The area highlighted in blue is the code bundled by vite.

`vite.resolve.alias` setting specifies a runtime-only module for Vue I18n, which reduces the bundle size.

Also, you can see the changing in the bandling of locale resources.

Code for locale resources, depending on whether or not the `@intlify/unplugin-vue-i18n` plugin to `vite.plugins` is set. Below:

![Pre-compile](/nuxt3-pre-compile.png)

Without the `@intlify/unplugin-vue-i18n` plugin to `vite.plugins`, locale resources are banded as **json**, but with this plugin set, locale resources are **converted from json to JavaScript code** for bandwidth.

Vue I18n just call the functions! if the locale resource is a function, since it has already been compiled.

In this tutorial,  the Nuxt 3 application is small, so we can not enough experience the performance of this optimization, but as the application gets larger, it will benefit from it.
