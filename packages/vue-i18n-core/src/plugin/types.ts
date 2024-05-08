/**
 * Vue I18n plugin options
 *
 * @remarks
 * An options specified when installing Vue I18n as Vue plugin with using `app.use`.
 *
 * @VueI18nGeneral
 */
export interface I18nPluginOptions {
  /**
   * Whether to globally install the components that is offered by Vue I18n
   *
   * @remarks
   * If this option is enabled, the components will be installed globally at `app.use` time.
   *
   * If you want to install manually in the `import` syntax, you can set it to `false` to install when needed.
   *
   * @defaultValue `true`
   */
  globalInstall?: boolean
}
