:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# 延迟加载

一次性加载所有的本地化文件是多余和不必要的。

使用打包器时，延迟加载或异步加载本地化文件非常容易。

假设我们的项目目录类似于下面这样：

```txt
├── dist
├── index.html
├── package.json
├── src
│   ├── App.vue
│   ├── components
│   ├── i18n.js
│   ├── index.css
│   ├── locales
│   │   ├── en.json
│   │   └── ja.json
│   ├── main.js
│   ├── pages
│   │   ├── About.vue
│   │   └── Home.vue
│   └── router.js
```

`pages` 文件夹是我们任意的 Vue 组件文件（如 `About.vue`）、路由初始化、i18n 初始化和其他文件所在的地方。`locales` 文件夹是我们所有本地化文件所在的地方，在 `i18n.js` 中，i18n 相关过程的函数定义如下：

```js
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

export const SUPPORT_LOCALES = ['en', 'ja']

export function setupI18n(options = { locale: 'en' }) {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale)
  return i18n
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  /**
   * 注意：
   * 如果你需要为 headers 指定语言设置，例如 `fetch` API，请在此处设置。
   * 以下是 axios 的示例。
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
  // 使用动态导入加载语言环境消息
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  )

  // 设置语言环境和语言环境消息
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}
```

导出以下三个函数：

- `setupI18n`
- `setI18nLanguage`
- `loadLocaleMessages`

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> 此代码示例还展示了如何使用 [i18n 实例的 `global` 属性](/api/general/interfaces/I18n.md#global) 在组件外部处理它。
> 关于 i18n 实例，请参阅 [API 参考](/api/general/interfaces/I18n.md)

<!-- eslint-enable markdown/no-missing-label-refs -->

`setupI18n` 函数接受与 `createI18n` 相同的选项，使用这些选项创建 i18n 实例，执行 `setI18nLanguage` 函数，并返回 i18n 实例。

`setI18nLanguage` 函数通过将参数 `i18n` 的 locale 设置为参数 `locale` 的值来设置语言。此外，此函数还可以将 HTML 文档的 `lang` 属性设置为参数 `locale` 的值。正如注释中所述，像 HTTP 客户端一样，你也可以设置语言。

`loadLocaleMessages` 函数是我们实际上将用来更改语言的函数。加载新文件是通过 `import` 函数完成的，该函数由 webpack 慷慨提供，它允许我们动态加载文件，并且因为它使用 promises，我们可以轻松地等待加载完成。

你可以在 [webpack 文档](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 中了解更多关于 import 函数的信息。

使用 `loadLocaleMessages` 函数很简单。常见的用例是在 vue-router beforeEach 钩子中。

这是 `router.js` 中 vue-router beforeEach 钩子部分的代码：

```js
  // 导航守卫
  router.beforeEach(async (to, from, next) => {
    const paramsLocale = to.params.locale

    // 如果 paramsLocale 不在 SUPPORT_LOCALES 中，则使用 locale
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return next(`/${locale}`)
    }

    // 加载语言环境消息
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale)
    }

    // 设置 i18n 语言
    setI18nLanguage(i18n, paramsLocale)

    return next()
  })
```