# Single file components


## Basic Usage

If you are building Vue component or Vue application using single file components, you can manage the locale messages with using i18n custom block.

The following in [single file components example](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc):

```html
<script>
export default {
  name: 'App'
}
</script>

<template>
  <label for="locale">locale</label>
  <select v-model="$i18n.locale">
    <option>en</option>
    <option>ja</option>
  </select>
  <p>message: {{ $t('hello') }}</p>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
```

In i18n custom blocks, the format of the locale messages resource is **json** format by default.

The locale messages defined by i18n custom blocks, are used as the  local scope in single file components.

If `$t('hello')` is used in the template, the `hello` key defined by `i18n` custom blocks is referred to.

:::tip NOTE
The Composition API requires `useI18n` to return the `setup` context in order to localize with reference to locale messages defined in the i18n custom blocks.

About how to usage of `useI18n` , see the [Composition API](./composition)
:::

To use i18n custom blocks, you need to use the following plugins for bundler.


## Bundling with Vite

### vite-plugin-vue-i18n

[vite-plugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n) is vite plugin for [Vite](https://github.com/vitejs/vite).

:::tip REQUIREMENTS
- vite: **v2-beta or later**
- @vitejs/plugin-vue: **v1.0.4 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/vite-plugin-vue-i18n
```

#### Configuration

See also [use global format](#use-global-format-with-vite-plugin) and [use global scope](#use-global-scope-with-vite-plugin).

vite config for example:

```ts
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,
      include: path.resolve(__dirname, './path/to/src/locales/**')
    })
  ]
})
```


## Bundling with webpack

### vue-i18n-loader

[vue-i18n-loader](https://github.com/intlify/bundle-tools/tree/main/packages/vue-i18n-loader) is loader plugin for [webpack](https://webpack.js.org/). Since single file components is bundled with [vue-loader](https://github.com/vuejs/vue-loader), you need to setting webpack config with vue-i18n-loader.

:::tip REQUIREMENTS
- webpack: **v4 or later**
- vue-loader: **v16 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/vue-i18n-loader
```

#### Configuration

See also [use global format](#use-global-format-with-webpack-plugin) and [use global scope](#use-global-scope-with-webpack-plugin).

Webpack config for example:

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // for i18n resources (json/json5/yaml)
      {
        test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
        type: 'javascript/auto',
        // Use `Rule.include` to specify the files of locale messages to be pre-compiled
        include: [
          path.resolve(__dirname, './src/locales'),
        ],
        loader: '@intlify/vue-i18n-loader'
      },
      // for i18n custom block
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      }
      // ...
    ]
  },
  // ...
}
```


## Bundling with Rollup

### rollup-plugin-vue-i18n

[rollup-plugin-vue-i18n](https://github.com/intlify/bundle-tools/tree/main/packages/rollup-plugin-vue-i18n) is rollup plugin for [rollup](https://rollupjs.org). Since single-file components is bundled with [rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue), you need to setting rollup config with rollup-plugin-vue

:::tip REQUIREMENTS
- rollup: **v2.32 or later**
- rollup-plugin-vue: **v6 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/rollup-plugin-vue-i18n
```

#### Configuration

See also [use global format](#use-global-format-with-rollup-plugin) and [use global scope](#use-global-scope-with-rollup-plugin).

Rollup config for example:

```js
import VuePlugin from 'rollup-plugin-vue'
import VueI18nPlugin from 'rollup-plugin-vue-i18n'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default [
  {
    input: path.resolve(__dirname, `./path/to/src/main.js`),
    output: {
      file: path.resolve(__dirname, `./path/to/dist/index.js`),
      format: 'cjs'
    },
    plugins: [
      // set `customBlocks` opton to `rollup-plugin-vue`
      VuePlugin({ customBlocks: ['i18n'] }),
      // set `rollup-plugin-vue-i18n` after **`rollup-plugin-vue`**
      VueI18nPlugin({
        // `include` option for i18n resources bundling
        include: path.resolve(__dirname, `./path/to/src/locales/**`)
      }),
      resolve(),
      commonjs()
    ]
  }
]
```


## Define locale messages importing

You can use `src` attribute:

```html
<i18n src="./myLang.json"></i18n>
```

```json
// ./myLang.json
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
```

In the above example, `src` attribute is set to `./myLang.json`, so the path of the component with the `i18n` custom blocks is the base directory, and `./myLang.json` is  defined as the resource for locale messages.


## Define Locale Messages each Locales

You can use `locale` attribute:

```html
<i18n locale="en">
{
  "hello": "hello world!"
}
</i18n>
```

In the above example, since the `locale` attribute is set to `en`, the locale messages defined in `i18n` custom blocks can be used as a resource for locale messages of `en`.


## Define multiple locale messages

You can use locale messages with multiple `i18n` custom blocks.

```html
<i18n src="./common/locales.json"></i18n>
<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
```

In the above, first custom block load the common locale message with `src` attribute, second custom block load the locale message that is defined only at single file component. These locale messages will be merged as locale message of component.

In this way, multiple custom blocks useful when want to be used as module.


## Locale messages other formats

`i18n` custom blocks supports resource formats other than `json`.

### YAML

You can load `yaml` format.

The `i18n` custom blocks below of `yaml` format:

```html
<i18n lang="yaml">
en:
  hello: "hello world!"
ja:
  hello: "こんにちは、世界！"
</i18n>
```

### JSON5

You can load `json5` format.

The `i18n` custom blocks below of `json5` format:

```html
<i18n lang="json5">
{
  // for english
  en: {
    hello: "hello world!"
  },
  // for japanese
  ja: {
    hello: "こんにちは、世界！"
  }
}
</i18n>
```

### Define global format

If you are using one of `@intlify/vite-plugin-vue-i18n` plugin on your project, you can also define the `lang` for all your inlined `i18n` custom blocks on all your SFC using the `defaultSFCLang` option.

:::warning NOTICE
`@intlify/vue-i18n-loader` and `@intlify/rollup-plugin-vue-i18n` are currently in progress to add this feature.
:::

On inlined `i18n` custom blocks that have specified the `lang` attribute, the `defaultSFCLang` is not applied.

For example, in order to configure `yml` format on all your inlined `i18n` custom blocks on all your SFC:

```html
<!-- custom block equivalent to &lt;i18n lang="yml"> -->
<i18n>
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

just configure `defaultSFCLang: "yml"` on your plugin configuration:

#### Use global format with vite plugin

```javascript
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

plugins: [
  vue(),
  vueI18n({
    defaultSFCLang: 'yml',
    /* other options */
  })
]
```

#### Use global format with webpack plugin (WIP)

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // for i18n resources (json/json5/yaml)
      {
        test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
        type: 'javascript/auto',
        defaultSFCLang: 'yml',
        /* other options */,
        loader: '@intlify/vue-i18n-loader'
      },
      // for i18n custom block
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      }
      // ...
    ]
  }
  // ...
}
```

#### Use global format with rollup plugin (WIP)

```javascript
plugins: [
  // set `customBlocks` opton to `rollup-plugin-vue`
  VuePlugin({ customBlocks: ['i18n'] }),
  // set `rollup-plugin-vue-i18n` after **`rollup-plugin-vue`**
  VueI18nPlugin({
    defaultSFCLang: 'yml',
    /* other options */
  }),
  /* other plugins */
]
```

## Define locale messages for global scope

You can use define locale messages for global scope with `global` attribute:

```html
<i18n global>
{
  "en": {
    "hello": "hello world!"
  }
}
</i18n>
```

In the above example, since the `global` attribute is set, the locale messages defined in `i18n` custom blocks can be merged as a resource for locale messages of global scope.

### Define global scope

If you are using one of `@intlify/vite-plugin-vue-i18n` plugin on your project, you can also define the `global` scope for all your `i18n` custom blocks on all your SFC using the `globalSFCScope` option.

:::warning NOTICE
`@intlify/vue-i18n-loader` and `@intlify/rollup-plugin-vue-i18n` are currently in progress to add this feature.
:::

**Warning**: beware enabling `globalSFCScope: true`, all `i18n` custom blocks in all your `SFC` will be on `global` scope.

For example, in order to configure `global` scope on all your `i18n` custom blocks on all your SFC:

```html
<!-- custom block equivalent to &lt;i18n lang="yml" global> -->
<i18n lang="yml">
en:
  hello: Hello
es:
  hello: Hola
</i18n>
```

or

```html
<!-- custom block equivalent to &lt;i18n src="./locales/myMessages.json" global> -->
<i18n src="./locales/myMessages.json5">
</i18n>
```

just configure `globalSFCScope: true` on your plugin configuration:

#### Use global format with vite plugin

```javascript
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

plugins: [
  vue(),
  vueI18n({
    globalSFCScope: true,
    /* other options */
  })
]
```

#### Use global format with webpack plugin (WIP)

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // for i18n resources (json/json5/yaml)
      {
        test: /\.(json5?|ya?ml)$/, // target json, json5, yaml and yml files
        type: 'javascript/auto',
        globalSFCScope: true,
        /* other options */,
        loader: '@intlify/vue-i18n-loader'
      },
      // for i18n custom block
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      }
      // ...
    ]
  }
  // ...
}
```

#### Use global format with rollup plugin (WIP)

```javascript
plugins: [
  // set `customBlocks` opton to `rollup-plugin-vue`
  VuePlugin({ customBlocks: ['i18n'] }),
  // set `rollup-plugin-vue-i18n` after **`rollup-plugin-vue`**
  VueI18nPlugin({
    globalSFCScope: true,
    /* other options */
  }),
  /* other plugins */
]
```


:::warn NOTICE
The locale messages for global scope defined in i18n custom blocks are available **only composition API mode**. You need to run `useI18n` option to `useScope: 'global'` at `setup`. About details, see the [Composition API](./composition).
:::


## Vue CLI

[Vue CLI](https://github.com/vuejs/vue-cli) hides the webpack configuration, so, if we want to add support to the `<i18n>` tag inside a single file component we need to modify the existing configuration.

In order to do that we have to create a `vue.config.js` at the root of our project. Once we have done that, we have to include the following:

```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('i18n-resource')
        .test(/\.(json5?|ya?ml)$/)
          .include.add(path.resolve(__dirname, './src/locales'))
          .end()
        .type('javascript/auto')
        .use('i18n-resource')
          .loader('@intlify/vue-i18n-loader')
    config.module
      .rule('i18n')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use('i18n')
          .loader('@intlify/vue-i18n-loader')
  }
}
```

## Quasar CLI

If we want to add support to the `<i18n>` tag inside a single file component in a [Quasar CLI](https://quasar.dev) project then we need to modify the existing configuration.

In order to do that we need to edit `quasar.conf.js` at the root of our project. Once we have done that, we have to include the following:

```js
build: {
  chainWebpack: chain => {
    chain.module
      .rule('i18n-resource')
        .test(/\.(json5?|ya?ml)$/)
          .include.add(path.resolve(__dirname, './src/locales'))
          .end()
        .type('javascript/auto')
        .use('i18n-resource')
          .loader('@intlify/vue-i18n-loader')
    chain.module
      .rule('i18n')
        .resourceQuery(/blockType=i18n/)
        .type('javascript/auto')
        .use('i18n')
          .loader('@intlify/vue-i18n-loader')
  }
}
```

We also need to make sure that we've installed `@intlify/vue-i18n-loader`:

```sh
npm i --save-dev @intlify/vue-i18n-loader
```
