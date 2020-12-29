# Vue I18n Contributing Guide

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Contributing Tests](#contributing-tests)
- [Financial Contribution](#financial-contribution)

## General Guidelines

Thanks for understanding that English is used as a shared language in this repository.
Maintainers do not use machine translation to avoid miscommunication due to error in translation.
If description of issue / PR are written in non-English languages, those may be closed.

It is of course fine to use non-English language, when you open a PR to translate documents and communicates with other users in same language.

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

  - For simple beginner questions, you can get quick answers from [`#vue-i18n` channel of Discord](https://chat.vuejs.org/)

  - For more complicated questions, you can use [the official forum](http://forum.vuejs.org/) or StackOverflow. Make sure to provide enough information when asking your questions - this makes it easier for others to help you!

- Try to search for your issue, it may have already been answered or even fixed in the development branch.

- Check if the issue is reproducible with the latest stable version of Vue. If you are using a pre-release, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

- It is recommended that you make a JSFiddle/JSBin/Codepen/CodeSandbox to demonstrate your issue. You could start based with [this template](http://jsfiddle.net/r8qnsfb1/) that already includes the latest version.

- For bugs that involves build setups, you can create a reproduction repository with steps in the README.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

## Pull Request Guidelines

- The `master` branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

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

You will need [Node.js](http://nodejs.org) **version 10+**, and [Yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

```bash
$ yarn # install the dependencies of the project
```


A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Rollup](https://rollupjs.org) for bundling
- [Jest](https://jestjs.io/) for unit testing
- [Puppeteer](https://pptr.dev/) for e2e testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting

## Scripts

### `yarn build`

The `build` script builds all public packages (packages without `private: true` in their `package.json`).

Packages to build can be specified with fuzzy matching:

```bash
# build message-compiler only
yarn build message-compiler

# build all packages
yarn build --all
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
yarn build message-compiler -f global
```

Multiple formats can be specified as a comma-separated list:

```bash
yarn build message-compiler -f esm-browser,cjs
```

#### Build with Source Maps

Use the `--sourcemap` or `-s` flag to build with source maps. Note this will make the build much slower.

#### Build with Type Declarations

The `--types` or `-t` flag will generate type declarations during the build and in addition:

- Roll the declarations into a single `.d.ts` file for each package;
- Generate an API report in `<projectRoot>/temp/<packageName>.api.md`. This report contains potential warnings emitted by [api-extractor](https://api-extractor.com/).
- Generate an API model json in `<projectRoot>/temp/<packageName>.api.json`. This file can be used to generate a Markdown version of the exported APIs.

### `yarn dev`

The `dev` script bundles a target package (default: `vue-i18n`) in a specified format (default: `global`) in dev mode and watches for changes. This is useful when you want to load up a build in an HTML page for quick debugging:

```bash
$ yarn dev

> rollup v1.19.4
> bundles packages/vue-i18n/src/index.ts → packages/vue-i18n/dist/vue-i18n.global.js...
```

- The `dev` script also supports fuzzy match for the target package, but will only match the first package matched.

- The `dev` script supports specifying build format via the `-f` flag just like the `build` script.

- The `dev` script also supports the `-s` flag for generating source maps, but it will make rebuilds slower.

### `yarn test`

The `test` script simply calls the `jest` binary, so all [Jest CLI Options](https://jestjs.io/docs/en/cli) can be used. Some examples:

```bash
# run all tests
$ yarn test

# run tests in watch mode
$ yarn test --watch

# run all tests under the runtime-core package
$ yarn test compiler

# run tests in a specific file
$ yarn test fileName

# run a specific test in a specific file
$ yarn test fileName -t 'test name'
```

## Project Structure

This repository employs a [monorepo](https://en.wikipedia.org/wiki/Monorepo) setup which hosts a number of associated packages under the `packages` directory:

- `shared`: Internal utilities shared across multiple packages.
- `message-resolver`: The message resolver.
- `message-compiler`: The message format compiler.
- `runtime`: The intlify runtime
- `core`: The intlify core.
- `vue-i18n`: The public facing "full build" which includes both the runtime AND the compiler.

### Importing Packages

The packages can import each other directly using their package names. Note that when importing a package, the name listed in its `package.json` should be used. Most of the time the `@intlify/` prefix is needed:

```js
import { baseCompile } from '@intlify/compiler'
```

This is made possible via several configurations:

- For TypeScript, `compilerOptions.path` in `tsconfig.json`
- For Jest, `moduleNameMapper` in `jest.config.js`
- For plain Node.js, they are linked using [Yarn Workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

## Contributing Tests

Unit tests are collocated with directories named `test`. Consult the [Jest docs](https://jestjs.io/docs/en/using-matchers) and existing test cases for how to write new test specs. Here are some additional guidelines:

Use the minimal API needed for a test case. For example, if a test can be written without involving the reactivity system ra component, it should be written so. This limits the test's exposure to changes in unrelated parts and makes it more stable.

## Financial Contribution

As a pure community-driven project without major corporate backing, we also welcome financial contributions via GitHub Sponsors and Patreon

- [Become a backer or sponsor on GitHub Sponsors](https://github.com/sponsors/kazupon)
- [Become a backer or sponsor on Patreon](https://www.patreon.com/evanyou)

Funds donated via GitHub Sponsors and Patreon go to support kazuya kawaguchi full-time work on Intlify.

## Credits

Thank you to all the people who have already contributed to Intlify project and my OSS work !
