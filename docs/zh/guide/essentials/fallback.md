# 回退机制 (Fallbacking)

`fallbackLocale: '<lang>'` 用于在首选语言缺少翻译时选择要使用的语言。

## 使用区域设置的隐式回退

如果给定的 `locale` 包含地区和可选的方言，则会自动激活隐式回退。

例如 `de-DE-bavarian` 将回退：
1. `de-DE-bavarian`
2. `de-DE`
3. `de`

要禁止自动回退，请添加后缀感叹号 `!`，例如 `de-DE!`。

## 使用单一区域设置的显式回退

有时某些项目不会翻译成某些语言。在此示例中，`hello` 项在英语中可用，但在日语中不可用：

```js
const messages = {
  en: {
    hello: 'Hello, world!'
  },
  ja: {
  }
}
```

如果你想在所需区域设置中没有可用项时使用（比如）`en` 项，请在 `createI18n` 中设置 `fallbackLocale` 选项：

```js
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
  messages
})
```

模板：

```html
<p>{{ $t('hello') }}</p>
```

输出：

```html
<p>Hello, world!</p>
```

默认情况下，回退到 `fallbackLocale` 会生成两个控制台警告：

```txt
[intlify] Not found 'hello' key in 'ja' locale messages.
[intlify] Fall back to translate 'hello' key with 'en' locale.
```

第一个警告消息打印了键，因为传递给翻译函数 `$t` 的键不在 `ja` 区域设置消息中；第二个警告消息是在你回退以从 `en` 区域设置消息解析本地化消息时出现的。这些警告消息的输出是为了支持使用 Vue I18n 进行调试。

:::tip 注意
默认情况下，这些警告消息仅在开发模式 (`process.env`<wbr/>`.NODE_ENV !== 'production'`) 下发出警告，不适用于生产环境。
:::

要在初始化 `createI18n` 时禁止第一个警告（`Not found key...`），请在传统 API 模式下设置 `silentTranslationWarn: true`，或在组合式 API 模式下设置 `missingWarn: false`。

要在初始化 `createI18n` 时禁止第二个警告（`Fall back to...`），请在传统 API 模式下设置 `silentFallbackWarn: true`，或在组合式 API 模式下设置 `fallbackWarn: false`。

## 使用区域设置数组的显式回退

可以通过使用区域设置数组来设置多个回退区域设置。例如：

<!-- eslint-skip -->

```javascript
fallbackLocale: [ 'fr', 'en' ],
```

## 使用决策映射的显式回退

如果需要更复杂的回退区域设置决策映射，可以使用相应的回退区域设置定义决策映射。

使用以下决策映射：

<!-- eslint-skip -->

```javascript
fallbackLocale: {
  /* 1 */ 'de-CH':   ['fr', 'it'],
  /* 2 */ 'zh-Hant': ['zh-Hans'],
  /* 3 */ 'es-CL':   ['es-AR'],
  /* 4 */ 'es':      ['en-GB'],
  /* 5 */ 'pt':      ['es-AR'],
  /* 6 */ 'default': ['en', 'da']
},
```

将导致以下回退链：

| locale | 回退链 |
|--------|-----------------|
| `'de-CH'`   | de-CH > fr > it > en > da |
| `'de'`      | de > en > da |
| `'zh-Hant'` | zh-Hant > zh-Hans > zh > en > da |
| `'es-SP'`   | es-SP > es > en-GB > en > da |
| `'es-SP!'`  | es-SP > en > da |
| `'fr'`      | fr > en > da |
| `'pt-BR'`   | pt-BR > pt > es-AR > es > en-GB > en > da |
| `'es-CL'`   | es-CL > es-AR > es > en-GB > en > da |

## 回退插值

当你的语言缺少键的翻译时，设置 `fallbackFormat: true` 以在翻译键上进行模板插值。

由于翻译的键是字符串，你可以使用用户可读的消息（针对特定语言）作为键。
例如：

```javascript
const messages = {
  ja: {
    'Hello, world!': 'こんにちは、世界!'
  }
}
```

这很有用，因为你不必指定字符串 "Hello, world!" 到英语的翻译。

实际上，你甚至可以在键中包含模板参数。结合 `fallbackFormat: true`，这让你跳过为你的“基础”语言编写模板；键*就是*你的模板。

```javascript
const messages = {
  ru: {
    'Hello {name}': 'Здравствуйте {name}'
  }
}

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  fallbackFormat: true,
  messages
})
```

当模板如下时：

```html
<p>{{ $t('Hello {name}', { name: 'John' }) }}</p>
<p>{{ $t('The weather today is {condition}!', { condition: 'sunny' }) }}</p>
```

将输出以下内容：

```html
<p>Здравствуйте, John</p>
<p>The weather today is sunny!</p>
```
