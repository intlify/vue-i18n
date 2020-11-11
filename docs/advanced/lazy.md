# Lazy loading

Loading all of your localization files at once is overkill and unnecessary.

Lazy loading or asynchronously loading the localization files is really easy when using bundler.

Let´s assume we have a project directory similar to the one below:

```
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

The `pages` folder is where our arbitrary Vue component files like the `About.vue`, router inits, i18n inits and other reside. The `locales` folder is where all of our localization files reside, and In `i18n.js`, the functions for i18n-related process are defined as follows:

```js
import { createI18n } from 'vue-i18n'

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
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(
      /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
    )
    i18n.global.setLocaleMessage(locale, messages.default)
  }
}
```

The following three functions are exported:

- `setupI18n`
- `setI18nLanguage`
- `loadLocaleMessages`

The `setupI18n` function takes the same options as `createI18n`, creates an instance of i18n with those options, executes the `setI18nLanguage` function, and returns the i18n instance.

The `setI18nLanguage` function sets the language by setting the locale of the parameter `i18n` to the value of the parameter `locale`. Besides, this function has the utility of setting the `lang` attribute of the HTML doocument to the value of the parameter `locale`. As noted in the comments, like the HTTP client, you can also set the language

The `loadLocaleMessages` function is what we will actually use to change the languages. Loading the new files is done via the `import` function, which is generously provided by webpack and it allows us to load files dynamically, and because it uses promises we can easily wait for the loading to finish.

You can learn more about the import function in the [Webpack documentation](https://webpack.js.org/guides/code-splitting/#dynamic-imports).

Using the `loadLocaleMessages` function is straightforward. A common use case is inside a vue-router beforeEach hook.

Here the code for the vue-router beforeEach hook part of `router.js`:

```js
  // navigation guards
  router.beforeEach((to, from, next) => {
    const locale = to.params.locale

    // check locale
    if (!SUPPORT_LOCALES.includes(locale)) {
      return false
    }

    // load locale messages
    loadLocaleMessages(i18n, locale)

    // set i18n language
    setI18nLanguage(i18n, locale)

    return next()
  })
```
