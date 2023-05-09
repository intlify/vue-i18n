# Vue I18n Contributing Guide

- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Contributing Tests](#contributing-tests)
- [Financial Contribution](#financial-contribution)

## General Guidelines

Thanks for understanding that English is used as a shared language in this repository.
Maintainers do not use machine translation to avoid miscommunication due to error in translation.
If description of issue / PR are written in non-English languages, those may be closed.

It is of course fine to use non-English language, when you open a PR to translate documents and communicates with other users in same language.

## Pull Request Guidelines

- The `master` branch is the latest stable version release. All development should be done in dedicated branches.

- Checkout a topic branch from the relevant branch, e.g. `master`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- If adding new feature:

  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:

  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- Make sure `npm test` passes. (see [development setup](#development-setup))

### Work Step Example

- Fork the repository from [intlify/vue-i18n-next](https://github.com/intlify/vue-i18n-next) !
- Create your topic branch from `master`: `git branch my-new-topic origin/master`
- Add codes and pass tests !
- Commit your changes: `git commit -am 'Add some topic'`
- Push to the branch: `git push origin my-new-topic`
- Submit a pull request to `master` branch of `intlify/vue-i18n-next` repository !

## Development Setup

You will need [Node.js](http://nodejs.org) **version 16+**, and [PNPM](https://pnpm.io).

We also recommend installing [ni](https://github.com/antfu/ni) to help switching between repos using different package managers. `ni` also provides the handy `nr` command which running npm scripts easier.

After cloning the repo, run:

```bash
$ pnpm i # install the dependencies of the project
```

A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Rollup](https://rollupjs.org) for bundling
- [Jest](https://jestjs.io/) for unit testing
- [Puppeteer](https://pptr.dev/) for e2e testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting

## Scripts

### `pnpm build`

The `build` script builds all public packages (packages without `private: true` in their `package.json`).

Packages to build can be specified with fuzzy matching:

```bash
# build message-compiler only
pnpm build -- message-compiler

# build all packages
pnpm build -- --all
```

#### Build Formats

By default, each package will be built in multiple distribution formats as specified in the `buildOptions.formats` field in its `package.json`. These can be overwritten via the `-f` flag. The following formats are supported:

- **`global`**

  - For direct use via `<script>` in the browser.
  - Note: global builds are not [UMD](https://github.com/umdjs/umd) builds. Instead they are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

- **`esm-bundler`**

  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (to be replaced by bundler)
  - Does not ship a minified build (to be done together with the rest of the code after bundling)
  - For use with bundlers like `webpack`, `rollup` and `parcel`.

- **`esm-browser`**

  - For usage via native ES modules imports (in browser via `<script type="module">`, or via Node.js native ES modules support in the future)
  - Inlines all dependencies - i.e. it's a single ES module with no imports from other files
    - This means you **must** import everything from this file and this file only to ensure you are getting the same instance of code.
  - Hard-coded prod/dev branches, and the prod build is pre-minified (you will have to use different paths/aliases for dev/prod)

- **`cjs`**

  - For use in Node.js server-side rendering via `require()`.
  - The dev/prod files are pre-built, but are dynamically required based on `process.env.NODE_ENV` in `index.js`, which is the default entry when you do `require('vue-i18n')`.

For example, to build `compiler` with the global build only:

```bash
pnpm build -- message-compiler -f global
```

Multiple formats can be specified as a comma-separated list:

```bash
pnpm build -- message-compiler -f esm-browser,cjs
```

#### Build with Source Maps

Use the `--sourcemap` or `-s` flag to build with source maps. Note this will make the build much slower.

#### Build with Type Declarations

The `--types` or `-t` flag will generate type declarations during the build and in addition:

- Roll the declarations into a single `.d.ts` file for each package;
- Generate an API report in `<projectRoot>/temp/<packageName>.api.md`. This report contains potential warnings emitted by [api-extractor](https://api-extractor.com/).
- Generate an API model json in `<projectRoot>/temp/<packageName>.api.json`. This file can be used to generate a Markdown version of the exported APIs.

### `pnpm dev`

The `dev` script bundles a target package (default: `vue-i18n`) in a specified format (default: `global`) in dev mode and watches for changes. This is useful when you want to load up a build in an HTML page for quick debugging:

```bash
$ pnpm dev

> rollup v1.19.4
> bundles packages/vue-i18n/src/index.ts → packages/vue-i18n/dist/vue-i18n.global.js...
```

- The `dev` script also supports fuzzy match for the target package, but will only match the first package matched.

- The `dev` script supports specifying build format via the `-f` flag just like the `build` script.

- The `dev` script also supports the `-s` flag for generating source maps, but it will make rebuilds slower.

### `pnpm test`

The `test` script simply calls the `jest` binary, so all [Jest CLI Options](https://jestjs.io/docs/en/cli) can be used. Some examples:

```bash
# run all tests
$ pnpm test

# run tests in watch mode
$ pnpm test -- --watch

# run all tests under the runtime-core package
$ pnpm test -- compiler

# run tests in a specific file
$ pnpm test -- fileName

# run a specific test in a specific file
$ pnpm test -- fileName -t 'test name'
```

## Project Structure

This repository employs a [monorepo](https://en.wikipedia.org/wiki/Monorepo) setup which hosts a number of associated packages under the `packages` directory:

- `shared`: Internal utilities shared across multiple packages.
- `message-compiler`: The intlify message format compiler.
- `core-base`: The inlitfy core base.
- `core`: The intlify core "full build" which includes both the runtime AND the compiler.
- `vue-i18n-core`: The vue-i18n core implementation package.
- `vue-i18n`: The vue-i18n "full build" which includes both the runtime AND the compiler.
- `vue-i18n-bridge`: The birdge package for migrating from vue-i18n@v8.26.1 or later.
- `petite-vue-i18n`: The vue-i18n "small build" which includes both the runtime AND the compiler.

### Importing Packages

The packages can import each other directly using their package names. Note that when importing a package, the name listed in its `package.json` should be used. Most of the time the `@intlify/` prefix is needed:

```js
import { baseCompile } from '@intlify/compiler'
```

This is made possible via several configurations:

- For TypeScript, `compilerOptions.path` in `tsconfig.json`
- For Jest, `moduleNameMapper` in `jest.config.js`
- For plain Node.js, they are linked using [PNPM Workspaces](https://pnpm.io/workspaces).

## Contributing Tests

Unit tests are collocated with directories named `test`. Consult the [Jest docs](https://jestjs.io/docs/en/using-matchers) and existing test cases for how to write new test specs. Here are some additional guidelines:

Use the minimal API needed for a test case. For example, if a test can be written without involving the reactivity system ra component, it should be written so. This limits the test's exposure to changes in unrelated parts and makes it more stable.

## Financial Contribution

As a pure community-driven project without major corporate backing, we also welcome financial contributions via GitHub Sponsors and Patreon

- [Become a backer or sponsor on GitHub Sponsors](https://github.com/sponsors/kazupon)

Funds donated via GitHub Sponsors and Patreon go to support kazuya kawaguchi full-time work on Intlify.

## Credits

Thank you to all the people who have already contributed to Intlify project and my OSS work !
