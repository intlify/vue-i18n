# Breaking Changes in v11

## Deprecate Legacy API mode

### Reason

The Legacy API mode was the API mode compatible with v8 for Vue 2. When v9 was released, the Legacy API was provided to smooth the migration from v8 to v9.

Legacy API mode will be deprecated in v11, as previous vue-i18n releases have already provided the following to support migration to Composition API mode

- Migration from Legacy API mode to Composition API mode: https://vue-i18n.intlify.dev/guide/migration/vue3.html
- Composition API usage: https://vue-i18n.intlify.dev/guide/advanced/composition.html

For compatibility, Legacy API mode still works in v11, but will be removed entirely in v12, so Legacy API mode will not work after that version.

## Drop `tc` and `$tc` for Legacy API mode

**Reason**: These APIs had already deprecated in warning about being dropped in v11. docs says, https://vue-i18n.intlify.dev/guide/migration/breaking10.html#deprecate-tc-and-tc-for-legacy-api-mode
