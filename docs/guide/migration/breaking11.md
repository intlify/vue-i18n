# Breaking Changes in v11

## Deprecate Legacy API mode

### Reason

The Legacy API mode was the API mode compatible with v8 for Vue 2. When v9 was released, the Legacy API was provided to smooth the migration from v8 to v9.

Legacy API mode will be deprecated in v11, as previous vue-i18n releases have already provided the following to support migration to Composition API mode

- Migration from Legacy API mode to Composition API mode: https://vue-i18n.intlify.dev/guide/migration/vue3.html
- Composition API usage: https://vue-i18n.intlify.dev/guide/advanced/composition.html

For compatibility, Legacy API mode still works in v11, but will be removed entirely in v12, so Legacy API mode will not work after that version.

## Deprecate Custom Directive `v-t`

### Reason

The advantage of `v-t` was that it could optimize performance using the vue compiler transform and the pre-translation of `vue-i18n-extension`.

This feature was supported from Vue 2.
About details see the blog article: https://medium.com/@kazu_pon/performance-optimization-of-vue-i18n-83099eb45c2d

In Vue 3, due to the Composition API, the pre-translation of `vue-i18n-extension` is now limited only for global scope.

In addition, Vue 3 Virtual DOM optimization has been introduced, and the optimization provided by `vue-i18n-extension` is no longer very effective. We need to require settings for SSR, the benefits of using `v-t` have disappeared. And DX of templates using `v-t` is not good. Custom directives do not work with key completion in editors (e.g. vscode).

For compatibility, `v-t` mode still works in v11, but will be removed entirely in v12, so `v-t` will not work after that version.

### for migration

You can use `eslint-plugin-vue-i18n`.

`eslint-plugin-vue-i18n` has `@intlify/vue-i18n/no-deprecated-v-t` rule. https://eslint-plugin-vue-i18n.intlify.dev/rules/no-deprecated-v-t.html

You must have migrated with eslint before upgrading to vue-i18n v11

## Drop `tc` and `$tc` for Legacy API mode

**Reason**: These APIs had already deprecated in warning about being dropped in v11. docs says, https://vue-i18n.intlify.dev/guide/migration/breaking10.html#deprecate-tc-and-tc-for-legacy-api-mode
