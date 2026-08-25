// @ts-check

/** @type {import('vitepress-api-references').OxContentApiDocsOptions} */
export default {
  entryPoints: [
    { path: 'packages/vue-i18n/src/index.ts', name: 'general' },
    { path: 'packages/vue-i18n/src/vue.ts', name: 'vue' }
  ],
  outDir: 'docs/api',
  basePath: '/api',
  tsconfig: 'tsconfig.typedoc.json',
  extraction: {
    internal: false,
    typeParameters: true,
    externalDocs: true
  },
  markdown: {
    pathStrategy: 'typedoc',
    renderStyle: 'markdown',
    indexFormat: 'table',
    parametersFormat: 'table',
    interfacePropertiesFormat: 'table',
    classPropertiesFormat: 'table',
    propertyMembersFormat: 'table',
    typeAliasPropertiesFormat: 'table',
    enumMembersFormat: 'table',
    renderGeneratedBy: false,
    renderStats: false,
    groupOrder: ['Variables', 'Functions', 'Class']
  },
  escapeHeadingAngleBrackets: true,
  clean: false,
  write: false
}
