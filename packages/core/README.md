# @intlify/core

The intlify core module for i18n

## Which dist file to use?

### From CDN or without a Bundler

- **`core(.runtime).global(.prod).js`**:
  - For direct use via `<script src="...">` in the browser. Exposes the `IntlifyCore` global
  - Note that global builds are not [UMD](https://github.com/umdjs/umd) builds.  They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and is only meant for direct use via `<script src="...">`
  - In-browser locale messages compilation:
    - **`core.global.js`** is the "full" build that includes both the compiler and the runtime so it supports compiling locale messages on the fly
    - **`core.runtime.global.js`** contains only the runtime and requires locale messages to be pre-compiled during a build step
  - Inlines internal the bellow packages - i.e. it’s a single file with no dependencies on other files. This means you **must** import everything from this file and this file only to ensure you are getting the same instance of code
    - `@intlify/shared`
    - `@intlify/message-compiler`
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.prod.js` files for production

- **`core(.runtime).esm-browser(.prod).js`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`)
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build

### With a Bundler

- **`core(.runtime).esm-bundler.js`**:
  - For use with bundlers like `webpack`, `rollup` and `parcel`
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)
  - Imports dependencies (e.g. `@intlify/message-compiler`)
    - Imported dependencies are also `esm-bundler` builds and will in turn import their dependencies (e.g. `@intlify/message-compiler` imports `@intlify/shared`)
    - This means you **can** install/import these deps individually without ending up with different instances of these dependencies, but you must make sure they all resolve to the same version
  - In-browser locale messages compilation:
    - **`core.runtime.esm-bundler.js` (default)** is runtime only, and requires all locale messages to be pre-compiled. This is the default entry for bundlers (via `module` field in `package.json`) because when using a bundler templates are typically pre-compiled (e.g. in `*.json` files)
    - **`core.esm-bundler.js`**: includes the runtime compiler. Use this if you are using a bundler but still want locale messages compilation (e.g. templates via inline JavaScript strings)

### For Node.js (Server-Side)

- **`core.cjs(.prod).js`**:
  - For CommonJS usage in Node.js
  - For use in Node.js via `require()`
  - If you bundle your app with webpack with `target: 'node'` and properly externalize `@intlify/core`, this is the build that will be loaded
  - The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env.NODE_ENV`

- **`core(.runtime).node.mjs`**:
  - For ES Moudles usage in Node.js
  - For use in Node.js via `import`
  - The dev/prod files are pre-built, but the appropriate file is automatically required based on `process.env.NODE_ENV`
  - This module is proxy module of `core(.runtime).mjs`
    - **`core.runtime.node.mjs`**: is runtime only. proxy `core.runtime.mjs`
    - **`core.node.mjs`**: includes the runtime compiler. proxy `core.mjs`

> NOTE: ES Modules will be the future of the Node.js module system. The `core.cjs(.prod).js` will be deprecated in the future. We recommend you would use `core(.runtime).node.mjs`. 9.3+


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
