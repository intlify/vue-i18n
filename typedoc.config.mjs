// @ts-check
/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions & { docsRoot?: string } } */
export default {
  /**
   * typedoc options
   * ref: https://typedoc.org/documents/Options.html
   */
  entryPoints: ['./packages/vue-i18n/src/index.ts', './packages/vue-i18n/src/vue.ts'],
  out: 'docs/api',
  cleanOutputDir: false,
  plugin: ['typedoc-plugin-markdown', 'typedoc-vitepress-theme'],
  readme: 'none',
  groupOrder: ['Variables', 'Functions', 'Class'],
  validation: {
    invalidLink: false
  },
  /**
   * typedoc-plugin-markdown options
   * ref: https://typedoc-plugin-markdown.org/docs/options
   */
  entryFileName: 'index',
  hidePageTitle: false,
  useCodeBlocks: true,
  disableSources: true,
  indexFormat: 'table',
  parametersFormat: 'table',
  interfacePropertiesFormat: 'list',
  classPropertiesFormat: 'table',
  propertyMembersFormat: 'table',
  typeAliasPropertiesFormat: 'table',
  enumMembersFormat: 'table',
  /**
   * typedoc-vitepress-theme options
   * ref: https://typedoc-plugin-markdown.org/plugins/vitepress/options
   */
  docsRoot: './docs'
}
