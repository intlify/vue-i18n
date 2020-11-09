# Single file components

## Basic Usage

If you are building Vue component or Vue application using single file components, you can manage the locale messages with using `i18n` custom block.

The following in [single file components example](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc):

```html
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

<template>
  <label for="locale">locale</label>
  <select v-model="$i18n.locale">
    <option>en</option>
    <option>ja</option>
  </select>
  <p>message: {{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

## Installing vue-i18n-loader

You need to install `vue-loader` and `vue-i18n-loader` due to use `<i18n>` custom blocks. While [vue-loader](https://github.com/vuejs/vue-loader) most likely is already used in your project if you are working with single file components, you must install [vue-i18n-loader](https://github.com/intlify/vue-i18n-loader) additionally:

```sh
npm i --save-dev @intlify/vue-i18n-loader
```

## Webpack

For webpack the configuration below is required:

For vue-loader v16 or later:
```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
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

## Vue CLI

[Vue CLI](https://github.com/vuejs/vue-cli) hides the webpack configuration, so, if we want to add support to the `<i18n>` tag inside a single file component we need to modify the existing configuration.

In order to do that we have to create a `vue.config.js` at the root of our project. Once we have done that, we have to include the following:

For vue-loader v16 or later:
```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
        .loader('@intlify/vue-i18n-loader')
        .end();
  }
}
```

## YAML loading

`i18n` custom blocks need to specify `JSON` format, also you can use `YAML` format by using pre-loader feature of `vue-loader`.

The `i18n` custom blocks below of `YAML` format:

```html
<i18n lang="yaml">
en:
  hello: "hello world!"
ja:
  hello: "こんにちは、世界！"
</i18n>
```

## Multiple custom blocks

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
