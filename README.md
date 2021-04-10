# vue-i18n-next

> This is the repository for Vue I18n 9 (for Vue 3)

Internationalization plugin for Vue.js

<h2 align="center">Supporting Vue I18n & Intlify Project</h2>

Vue I18n is part of the Vue Ecosystem and Intlify Project is an open source project with its ongoing development made possible entirely by the support of Sponsors. If you would like to become a sponsor, please consider:

- [Become a Sponsor on GitHub](https://github.com/sponsors/kazupon)

<h3 align="center">🥇 Gold Sponsors</h3>

<p align="center">
  <a
    href="https://nuxtjs.org/"
    target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/nuxt.png"
      width="240px"
    />
  </a>
</p>

<h3 align="center">🥈 Silver Sponsors</h3>

<p align="center">
  <a
    href="https://www.codeandweb.com/babeledit?utm_campaign=vue-i18n-2019-01" 
    target="_blank">
    <img
      src="https://secure.codeandweb.com/static/babeledit.svg"
      width="200px"
    />
  </a>
</p>

<h3 align="center">🥉 Bronze Sponsors</h3>

<p align="center">
  <a href="https://zenarchitects.co.jp/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/zenarchitects.png"
      width="144px"
    />
  </a>
</p>
<p align="center">
  <a href="https://www.sendcloud.com/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/sendcloud.png"
      width="144px"
    />
  </a>
</p>
<p align="center">
  <a href="https://www.vuemastery.com/" target="_blank">
    <img
      src="https://raw.githubusercontent.com/intlify/vue-i18n-next/master/docs/public/vuemastery.png"
      width="144px"
    />
  </a>
</p>

<br/>

## Status: ![Test](https://github.com/intlify/vue-i18n-next/workflows/Test/badge.svg)

- [Documentation](https://vue-i18n.intlify.dev/)
- If you use Vue I18n v8, see this [repository](https://github.com/kazupon/vue-i18n)

## Quickstart

- Via CDN: `<script src="https://unpkg.com/vue-i18n@9"></script>`
- In-browser playground on [CodeSandbox](https://codesandbox.io/s/vue-i18n-9-template-h28c0)
- Add it to an existing Vue Project:
  ```bash
  npm install vue-i18n@next
  ```

## Changes from Vue I18n v8

Please consult the [Migration Guide](https://vue-i18n.intlify.dev/guide/migration/breaking.html).

## :raising_hand: About support for v9 and earlier
- v6 and earlier: drop supporting
- v7 and v8: become LTS upon vue-i18n v9 release with an 12 months maintenance lifespan

## :lollipop: Examples

See the [`examples`](https://github.com/intlify/vue-i18n-next/tree/master/examples) directory.

The examples are offered in the following two API styles:

- composition
  - Examples using the new Vue I18n API for Vue 3 Composition API
- legacy
  - Examples using the Vue I18n API that are almost compatible with Vue I18n v8.x


## :package: Main Packages

| Package | NPM |
| ------- | --- |
| [vue-i18n](packages/vue-i18n) | [![vue-i18n](https://img.shields.io/npm/v/vue-i18n/next.svg)](https://www.npmjs.com/package/vue-i18n)
| [@intlify/core](packages/core) | [![@intlify/core](https://img.shields.io/npm/v/@intlify/core/next.svg)](https://www.npmjs.com/package/@intlify/core)
| [@intlify/core-base](packages/core-base) | [![@intlify/core-base](https://img.shields.io/npm/v/@intlify/core-base.svg)](https://www.npmjs.com/package/@intlify/core-base)
| [@intlify/runtime](packages/runtime) | [![@intlify/runtime](https://img.shields.io/npm/v/@intlify/runtime.svg)](https://www.npmjs.com/package/@intlify/runtime)
| [@intlify/message-compiler](packages/message-compiler) | [![@intlify/message-compiler](https://img.shields.io/npm/v/@intlify/message-compiler.svg)](https://www.npmjs.com/package/@intlify/message-compiler)
| [@intlify/message-resolver](packages/message-resolver) | [![@intlify/message-resolver](https://img.shields.io/npm/v/@intlify/message-resolver.svg)](https://www.npmjs.com/package/@intlify/message-resolver)
| [@intlify/shared](packages/shared) | [![@intlify/shared](https://img.shields.io/npm/v/@intlify/shared.svg)](https://www.npmjs.com/package/@intlify/shared)

## :runner: Other Projects

| Project | NPM | Repo |
| ------- | --- | ---- |
| Vue CLI Plugin | [![vue-cli-plugin-i18n](https://img.shields.io/npm/v/vue-cli-plugin-i18n.svg)](https://www.npmjs.com/package/vue-cli-plugin-i18n) | [intlify/vue-cli-plugin-i18n](https://github.com/intlify/vue-cli-plugin-i18n)
| Vue I18n Extensions | [![@intlify/vue-i18n-extensions](https://img.shields.io/npm/v/@intlify/vue-i18n-extensions/next.svg)](https://www.npmjs.com/package/@intlify/vue-i18n-extensions) | [intlify/vue-i18n-extentions](https://github.com/intlify/vue-i18n-extensions)
| ESLint Plugin | [![@intlify/eslint-plugin-vue-i18n](https://img.shields.io/npm/v/@intlify/eslint-plugin-vue-i18n.svg)](https://www.npmjs.com/package/@intlify/eslint-plugin-vue-i18n) | [intlify/eslint-plugin-vue-i18n](https://github.com/intlify/eslint-plugin-vue-i18n)
| Composition API for Vue 2.x | [![vue-i18n-composable](https://img.shields.io/npm/v/vue-i18n-composable.svg)](https://www.npmjs.com/package/vue-i18n-composable) | [intlify/vue-i18n-composable](https://github.com/intlify/vue-i18n-composable)
| CLI | [![intlify/cli](https://img.shields.io/npm/v/@intlify/cli.svg)](https://www.npmjs.com/package/@intlify/cli) | [intlify/cli](https://github.com/intlify/cli)
| Vite Plugin | [![@intlify/vite-plugin-vue-i18n](https://img.shields.io/npm/v/@intlify/vite-plugin-vue-i18n.svg)](https://www.npmjs.com/package/@intlify/vite-plugin-vue-i18n) | [intlify/vite-plugin-vue-i18n](https://github.com/intlify/vite-plugin-vue-i18n)
| Webpack Loader | [![@intlify/vue-i18n-loader](https://img.shields.io/npm/v/@intlify/vue-i18n-loader/next.svg)](https://www.npmjs.com/package/@intlify/vue-i18n-loader) | [intlify/vue-i18n-loader](https://github.com/intlify/vue-i18n-loader)
| Rollup Plugin | [![@intlify/rollup-plugin-vue-i18n](https://img.shields.io/npm/v/@intlify/rollup-plugin-vue-i18n/next.svg)](https://www.npmjs.com/package/@intlify/rollup-plugin-vue-i18n) | [intlify/rollup-plugin-vue-i18n](https://github.com/intlify/rollup-plugin-vue-i18n)
| Vue Jest Plugin | [![vue-i18n-jest](https://img.shields.io/npm/v/vue-i18n-jest.svg)](https://www.npmjs.com/package/vue-i18n-jest) | [intlify/vue-i18n-jest](https://github.com/intlify/vue-i18n-jest)
| Vue I18n Locale Message Tools | [![vue-i18n-locale-message](https://img.shields.io/npm/v/vue-i18n-locale-message.svg)](https://www.npmjs.com/package/vue-i18n-locale-message) | [intlify/vue-i18n-locale-message](https://github.com/intlify/vue-i18n-locale-message)

## :muscle: Contribution

Please make sure to read the [Contributing Guide](https://github.com/intlify/vue-i18n-next/blob/master/.github/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
