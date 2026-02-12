# 遅延読み込み

すべてのローカリゼーションファイルを一度に読み込むのはやりすぎであり、不要です。

バンドラを使用する場合、ローカリゼーションファイルの遅延読み込みまたは非同期読み込みは非常に簡単です。

以下のようなプロジェクトディレクトリがあると仮定します：

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

`pages` フォルダは、`About.vue`、ルーターの初期化、i18n の初期化などの任意の Vue コンポーネントファイルが存在する場所です。`locales` フォルダはすべてのローカリゼーションファイルが存在する場所であり、`i18n.js` では、i18n 関連の処理の関数が以下のように定義されています：

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
   * NOTE:
   * `fetch` API などのヘッダーに言語設定を指定する必要がある場合は、ここで設定します。
   * 以下は axios の例です。
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
  // 動的インポートでロケールメッセージを読み込む
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  )

  // ロケールとロケールメッセージを設定
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}
```

以下の 3 つの関数がエクスポートされます：

- `setupI18n`
- `setI18nLanguage`
- `loadLocaleMessages`

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> このコード例は、[i18n インスタンスの `global` プロパティ](../../api/general/interfaces/I18n.md#global) を使用してコンポーネントの外部で処理する方法も示しています。
> i18n インスタンスについては、[API リファレンス](../../api/general/interfaces/I18n.md) を参照してください

<!-- eslint-enable markdown/no-missing-label-refs -->

`setupI18n` 関数は `createI18n` と同じオプションを受け取り、それらのオプションで i18n のインスタンスを作成し、`setI18nLanguage` 関数を実行して、i18n インスタンスを返します。

`setI18nLanguage` 関数は、パラメータ `i18n` のロケールをパラメータ `locale` の値に設定することで言語を設定します。さらに、この関数には、HTML ドキュメントの `lang` 属性をパラメータ `locale` の値に設定するユーティリティがあります。コメントに記載されているように、HTTP クライアントのように言語を設定することもできます。

`loadLocaleMessages` 関数は、実際に言語を変更するために使用する関数です。新しいファイルの読み込みは `import` 関数を介して行われます。これは webpack によって寛大に提供されており、ファイルを動的に読み込むことができ、プロミスを使用しているため、読み込みの完了を簡単に待つことができます。

インポート関数の詳細については、[webpack ドキュメント](https://webpack.js.org/guides/code-splitting/#dynamic-imports) で確認できます。

`loadLocaleMessages` 関数の使用は簡単です。一般的な使用例は、vue-router の beforeEach フック内です。

`router.js` の vue-router beforeEach フック部分のコードは次のとおりです：

```js
  // ナビゲーションガード
  router.beforeEach(async (to, from, next) => {
    const paramsLocale = to.params.locale

    // paramsLocale が SUPPORT_LOCALES にない場合は locale を使用
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return next(`/${locale}`)
    }

    // ロケールメッセージを読み込む
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale)
    }

    // i18n 言語を設定
    setI18nLanguage(i18n, paramsLocale)

    return next()
  })
```
