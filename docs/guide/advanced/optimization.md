# Optimization


## Performance

As described in "[installation](../installation##from-cdn-or-without-a-bundler)" section, Vue I18n offer the following two built ES modules for Bundler.

- message compiler + runtime: **`vue-i18n.esm-bundler.js`**
- runtime only: **`vue-i18n.runtime.esm-bundler.js`**

For bundler, it’s configured to bundle `vue-i18n.esm-bundler.js` with [`@intlify/bundle-tools`](https://github.com/intlify/bundle-tools#intlifybundle-tools) as default. If you want to reduce the bundle size further, you can configure the bundler to use `vue-i18n.runtime.esm-bundler.js`, which is runtime only.

:::danger NOTE
IF [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) is enabled, `vue-i18n.esm-bundler.js` would not work with compiler due to `eval` statements. These statements violate the `default-src 'self'` header. Instead you need to use `vue-i18n.runtime.esm-bundler.js`.
:::

:::warning NOTICE
From v9.3, the CSP issue can be worked around by JIT compilation of the vue-i18n message compiler. See [JIT compilation for details](#jit-compilation).
:::

The use of this ES Module means that **all locale messages have to pre-compile to Message functions**. what this means it improves performance because vue-i18n just only execute Message functions, so no compilation.

Also, the message compiler is not bundled, therefore **bundle size can be reduced**

:::warning NOTICE
If you are using the JIT compilation, all locale messages will not necessarily be compiled with the Message function.

Also, since the message compiler is also bundled, the bundle size cannot be reduced. **This is a trade-off**.
:::


## How to configure

We can configure these modules with module path using the module resolve alias feature (e.g. `resolve.alias` vite and webpack) of some bundler, but It takes time and effort.
Intlify project provides plugins/loaders for some bundlers, for simplicity

### unplugin-vue-i18n

[`unplugin`](https://github.com/unjs/unplugin) is an unified plugin system for bundle tool such as vite, webpack, rollup, esbuild and etc.

Intlify project is providing [`unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n) for vite and webpack.

If you do the production build, Vue I18n will automatically bundle the runtime only module

#### Install plugin

```sh
npm install --save-dev @intlify/unplugin-vue-i18n
```

#### Configure plugin for vite

```js
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
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
  ],
})
```

#### Configure plugin for webpack

```js
// webpack.config.js
const path = require('path')
const VueI18nPlugin = require('@intlify/unplugin-vue-i18n/webpack')

module.exports = {
  /* ... */
  plugins: [
    /* ... */
    VueI18nPlugin({
      /* options */
      // locale messages resourece pre-compile option
      include: path.resolve(__dirname, './path/to/src/locales/**'),
    })
  ]
}
```

#### More configuration

About options and features, see the detail [page](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n)

### vite-plugin-vue-i18n

[`vite`](https://vitejs.dev/) is next generation frontend tooling.

Intlify project is providing [`vite-plugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n)

If you do a production build, Vue I18n will automatically bundle the runtime only module

:::warning NOTICE
This plugin will be deprecated in the near future, because we can replace `@intlify/unplugin-vue-i18n`.
:::

#### Install plugin

```sh
npm install --save-dev @intlify/vite-plugin-vue-i18n
```

#### Configure

```js
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

export default defineConfig({
  /* ... */
  plugins: [
    /* ... */
    vueI18n({
      /* options */
      // locale messages resourece pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './path/to/src/locales/**'),
    }),
  ]
})
```

#### More configuration

About options and features, see the detail [page](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n)

### vue-i18n-loader

[webpack](https://webpack.js.org/) is a static module bundler for modern JavaScript applications. 

Intlify project is providing [`vue-i18n-loader`](https://github.com/intlify/bundle-tools/tree/main/packages/vue-i18n-loader)

:::warning NOTICE
This plugin will be deprecated in the near future, because we can replace `@intlify/unplugin-vue-i18n`.
:::

#### Install loader

```sh
npm install --save-dev @intlify/vue-i18n-loader
```

#### Configure

```js
// webpack.config.js
const path = require('path')

module.exports = {
  /* ... */
  resolve: {
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
    }
  },
  /* ... */
  module: {
    rules: [
      // ...
      {
        test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader',
        include: [ // Use `Rule.include` to specify the files of locale messages to be pre-compiled
          path.resolve(__dirname, 'src/locales')
        ]
      },
      // ...
    ]
  }
}
```

#### More configuration

About options and features, see the detail [page](https://github.com/intlify/bundle-tools/tree/main/packages/vue-i18n-loader)

### Quasar CLI

No need to do anything. [Quasar CLI](https://quasar.dev) takes care of the optimizations for you.


## Feature build flags

### Reduce bundle size with tree-shaking

The `esm-bundler` builds now exposes global feature flags that can be overwritten at compile time:

- `__VUE_I18N_FULL_INSTALL__` (enable/disable, in addition to vue-i18n APIs, components and directives all fully support installation: `true`)
- `__VUE_I18N_LEGACY_API__` (enable/disable vue-i18n legacy style APIs support, default: `true`)

The build will work without configuring these flags, however it is **strongly recommended** to properly configure them in order to get proper tree shaking in the final bundle.

About how to configure for bundler, see the [here](#configure-feature-flags-for-bundler).

### JIT compilation

:::tip Support Version
:new: 9.3+
:::

Before v9.3, vue-i18n message compiler precompiled locale messages like AOT.

However, it had the following issues:

- CSP issues: hard to work on service/web workers, edge-side runtimes of CDNs and etc.
- Back-end integration: hard to get messages from back-end such as database via API and localize them dynamically

To solve these issues, JIT style compilation is supported message compiler.

the each time localization is performed in an application using `$t` or `t` functions, message resources will be compiled on message compiler.

You need to configure the following feature flag with `esm-bundler` build and bundler such as vite:

- `__INTLIFY_JIT_COMPILATION__`  (enable/disable message compiler for JIT style, default: `false`) 

:::warning NOTICE
This feature is opted out as default, because compatibility with previous version before v9.3.
:::

About how to configure for bundler, see the [here](#configure-feature-flags-for-bundler).


### Configure feature flags for bundler

- webpack: use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)
- Rollup: use [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)
- Vite: configured by default, but can be overwritten using the [`define` option](https://github.com/vitejs/vite/blob/a4133c073e640b17276b2de6e91a6857bdf382e1/src/node/config.ts#L72-L76)
- Quasar CLI: configured by default, but can be overwritten using quasar.conf.js > build > [env option](https://quasar.dev/quasar-cli/handling-process-env#adding-to-process-env)

:::tip NOTE
If you are using Vite, you can do the same thing by specifying the option in the [plugin provided officially](https://github.com/intlify/vite-plugin-vue-i18n).

Also, if you are using the Vue CLI, you can use the [officially provided plugin](https://github.com/intlify/vue-cli-plugin-i18n) to optimize the settings in `vue.config.js`.
:::

:::tip NOTE
The replacement value **must be boolean literals** and cannot be strings, otherwise the bundler/minifier will not be able to properly evaluate the conditions.
:::


## Pre translations with extensions

You can use pre-translation(server-side rendering) with vue-i18n-extensions package.

About how to usage, see [here](https://github.com/intlify/vue-i18n-extensions).
