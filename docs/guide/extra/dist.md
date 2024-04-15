# Different Distribution files
In the [dist/ directory of the npm package](https://cdn.jsdelivr.net/npm/vue-i18n@9.1.10/dist/) you will find many different builds of Vue I18n. Here is an overview of which dist file should be used depending on the use-case.

## From CDN or without a Bundler

- **`vue-i18n(.runtime).global(.prod).js`**:
  - For direct use via `<script src="...">` in the browser. Exposes the `VueI18n` global
  - In-browser message format compilation:
    - `vue-i18n.global.js` is the "full" build that includes both the compiler and the runtime so it supports compiling message formats on the fly
    - `vue-i18n.runtime.global.js` contains only the runtime and requires message formats to be pre-compiled during a build step
  - Inlines all Vue I18n core internal packages - i.e. it’s a single file with no dependencies on other files. This means you **must** import everything from this file and this file only to ensure you are getting the same instance of code
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production

:::tip NOTE
Global builds are not [UMD](https://github.com/umdjs/umd) builds. They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and are only meant for direct use via `<script src="...">`.
:::

- **`vue-i18n(.runtime).esm-browser(.prod).js`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`)
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build

## With a Bundler

- **`vue-i18n(.runtime).esm-bundler.js`**:
  - For use with bundlers like `webpack`, `rollup` and `parcel`
  - Leaves prod/dev branches with `process.env`<wbr/>`.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)
  - Imports dependencies (e.g. `@intlify/core-base`, `@intlify/message-compiler`)
    - Imported dependencies are also `esm-bundler` builds and will in turn import their dependencies (e.g. `@intlify/message-compiler` imports `@intlify/shared`)
    - This means you **can** install/import these deps individually without ending up with different instances of these dependencies, but you must make sure they all resolve to the same version
  - In-browser locale messages compilation:
    - **`vue-i18n.runtime.esm-bundler.js`** is runtime only, and requires all locale messages to be pre-compiled. This is the default entry for bundlers (via `module` field in `package.json`) because when using a bundler templates are typically pre-compiled (e.g. in `*.json` files)
    - **`vue-i18n.esm-bundler.js` (default)**: includes the runtime compiler. Use this if you are using a bundler but still want locale messages compilation (e.g. templates via inline JavaScript strings).  To use this build, change your import statement to: `import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";`

:::tip NOTE
If you use `vue-i18n.runtime.esm-bundler.js`, you will need to precompile all locale messages, and you can do that with `.json` (`.json5`) or `.yaml`, i18n custom blocks to manage i18n resources. Therefore, you can be going to pre-compile all locale messages with bundler and the following loader / plugin.

- [`@intlify/unplugin-vue-i18n`](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
:::

## For Node.js (Server-Side)

- **`vue-i18n.cjs(.prod).js`**:
  - For CommonJS usage in Node.js
  - For use in Node.js via `require()`
  - If you bundle your app with webpack with `target: 'node'` and properly externalize `vue-i18n`, this is the build that will be loaded
  - The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env`<wbr/>`.NODE_ENV`

:::tip Support Version
:new: 9.3+
:::

- **`vue-i18n(.runtime).node.mjs`**:
  - For ES Modules usage in Node.js
  - For use in Node.js via `import`
  - The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env`<wbr/>`.NODE_ENV`
  - This module is proxy module of `vue-i18n(.runtime).mjs`
    - **`vue-i18n.runtime.node.mjs`**: is runtime only. proxy `vue-i18n.runtime.mjs`.
    - **`vue-i18n.node.mjs`**: includes the runtime compiler. proxy `vue-i18n.mjs`.

:::tip NOTE
ES Modules will be the future of the Node.js module system. The `vue-i18n.cjs(.prod).js` will be deprecated in the future. We recommend you would use `vue-i18n(.runtime).node.mjs`.
:::
