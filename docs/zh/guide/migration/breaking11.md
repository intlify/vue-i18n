# v11 重大变更

## 弃用传统 API 模式

### 原因

传统 API 模式是与 Vue 2 的 v8 兼容的 API 模式。发布 v9 时，提供了传统 API 以平滑从 v8 到 v9 的迁移。

传统 API 模式将在 v11 中弃用，因为以前的 vue-i18n 版本已经提供了以下内容来支持迁移到组合式 API 模式：

- 从传统 API 模式迁移到组合式 API 模式: https://vue-i18n.intlify.dev/guide/migration/vue3.html
- 组合式 API 使用方法: https://vue-i18n.intlify.dev/guide/advanced/composition.html

为了兼容性，传统 API 模式在 v11 中仍然有效，但将在 v12 中完全删除，因此传统 API 模式在该版本之后将不再起作用。

## 弃用自定义指令 `v-t`

### 原因

`v-t` 的优点是可以使用 vue 编译器转换和 `vue-i18n-extension` 的预翻译来优化性能。

此功能从 Vue 2 开始支持。
有关详细信息，请参阅博客文章：https://medium.com/@kazu_pon/performance-optimization-of-vue-i18n-83099eb45c2d

在 Vue 3 中，由于组合式 API，`vue-i18n-extension` 的预翻译现在仅限于全局范围。

此外，Vue 3 引入了虚拟 DOM 优化，`vue-i18n-extension` 提供的优化不再非常有效。我们需要 SSR 的设置，使用 `v-t` 的好处已经消失。并且使用 `v-t` 的模板的开发体验（DX）并不好。自定义指令不适用于编辑器（例如 vscode）中的键补全。

为了兼容性，`v-t` 模式在 v11 中仍然有效，但将在 v12 中完全删除，因此 `v-t` 在该版本之后将不再起作用。

### 迁移

你可以使用 `eslint-plugin-vue-i18n`。

`eslint-plugin-vue-i18n` 具有 `@intlify/vue-i18n/no-deprecated-v-t` 规则。https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-v-t.html

在升级到 vue-i18n v11 之前，你必须使用 eslint 进行迁移

## 放弃传统 API 模式的 `tc` 和 `$tc`

**原因**: 这些 API 已经弃用并警告将在 v11 中删除。文档说明：https://vue-i18n.intlify.dev/guide/migration/breaking10.html#deprecate-tc-and-tc-for-legacy-api-mode
