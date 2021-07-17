# TypeScript Support

:::tip Support Version
:new: 9.2+
:::

VueI18n では locale messages, datetime formats、そして number formats といったリソースを取り扱います。
特に、 locale messages は、Localization service を使った翻訳者とコラボレーションするために、`json` ファイルなどにi18nリソースとして外部化し、そのリソースを取り込むことで連携します。

Localization Serviceと連携した円滑なローカライズワークフローを実現するために、外部化された i18n resource に対して、ローカライズ漏れやリソースの定義漏れを防ぎたいことがあります。そして開発において、`$t` の key の文字列指定のミス防ぐことで、開発者体験を損ないたくないことが多々あるでしょう。

## Type-safe resources with schema

TypeScript を利用することで、リソースをスキーマを定義して、型安全な resources をサポートできます。

### `createI18n`における型安全なリソース

以下は、`createI18n` のオプションで定義する `messages` に対する型安全な resrouces を定義するコード例です。

locale messages resource:
```json
{
  "world": "the world!"
}
```

アプリケーションのエントリポイント:
```typescript
import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'

// 'en-US' をリソースのマスタースキーマとして型定義する
type MessageSchema = typeof enUS

const i18n = createI18n<[MessageSchema], 'en-US' | 'ja-JP'>({
  locale: 'en-US',
  messages: {
    'en-US': enUS
  }
})
```

上記のコードでは、`createI18n`の`messages`オプションに指定する`en-US`メッセージリソースから型を定義しています。この定義した型は、VueI18nで取り扱うメッセージリソースのマスター的なスキーマです。つまり、アプリケーションにおいて、**single-of-truth**のリソースとして定義できるようになります。メッセージリソースからスキーマとして定義した型を`createI18n`の型パラメータの第1引数に指定することで、他の locale において型安全なリソースを定義することが可能になります。

`createI18n`の型パラメータの第2引数には、取り扱う locale を指定します。これにより、第1引数で指定されたリソースの型を元に、この第2引数に指定された locale ごとに型チェックをします。上記のコード例では、`locale`オプションにも指定されているメイン locale となる`en-US`、そして`ja-JP`が指定されています。この状態で、typescript のコンパイルすると以下のようなエラーが発生し、`messages`オプションに `ja-JP` のリソースが定義されていないことをチェックすることができます。 

```sh
$ npx tsc
npx tsc
src/main.ts:11:3 - error TS2741: Property '"ja-JP"' is missing in type '{ 'en-US': { world: string; }; }' but required in type '{ "en-US": { world: string; }; "ja-JP": { world: string; }; }'.

11   messages: {
     ~~~~~~~~

  node_modules/vue-i18n/dist/vue-i18n.d.ts:712:5
    712     messages?: {
            ~~~~~~~~
    The expected type comes from property 'messages' which is declared here on type 'I18nOptions<{ message: { world: string; }; datetime: DateTimeFormat; number: NumberFormat; }, { messages: "en-US"; datetimeFormats: "en-US"; numberFormats: "en-US"; } | { ...; }, ComposerOptions<...> | VueI18nOptions<...>>'


Found 1 error.
```

Visual Studio code をeditorとして使っている場合は、typescript のコンパイルを実行する前に、editor で以下のようなエラーで、リソースの定義漏れがあることを気づくことができます。

![VSCode-Type-Error1](/ts-support-1.png)
![VSCode-Type-Error2](/ts-support-2.png)

### `useI18n`における型安全なリソース

型安全なリソースの定義は、`createI18n`だけでなく、Composition API で使用する `useI18n` を使ってコンポーネント単位で型安全なリソースを定義することができます。

また、リソースの型定義は、local messages だけでなく、datetime formats、そして、number formats も定義することができます。

以下は、`useI18n` でコンポーネント単位で、locale messages、そして number formats に対して型安全なリソースを定義するコードの例です。

以下はVueコンポーネントでimportするlocale mesasgesです

```json
{
  "messages": {
    "hello": "Hello, {name}!"
  }
}
```

以下は、locale messages そして number formats の型安全なリソースが定義されたVueコンポーネントです

```html
<template>
  <p>message: {{ t('messages.hello', { name: 'kazupon' }) }}</p>
  <p>currecy: {{ n(1000, 'currency') }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import enUS from './en-US.json' // import locale messages for Vue component

// define message schema for Vue component
type MessageSchema = typeof enUS

// define number format schema for Vue component
type NumberSchema = {
  currency: {
    style: 'currency',
    currencyDisplay: 'symbol'
    currency: string
  }
}

// define Vue component
export default defineComponent({
  setup() {
    /**
     * You can specify the your definition schema with object literal at first type parameters
     * About type parameter, see the http://vue-i18n.intlify.dev/api/composition.html#usei18n
     */
    const { t, n } = useI18n<{
      message: MessageSchema,
      number: NumberSchema
    }, 'en-US'>({
      inheritLocale: true,
      messages: {
        'en-US': enUS
      },
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: 'USD'
          }
        }
      }
    })
    return { t, n }
  }
})
</script>
```

上記コードのように、`useI18n`の第1型パラメータに定義したスキーマを指定することで、locale messages、そして number formats に対してリソースの定義漏れをTypeScriptでチェックすることができます。また第2型パラメータに定義するlocaleを指定することで、定義漏れのlocaleもTypeScriptでチェックすることができます。

:::warning Limitation
- Type safety is not supported for i18n custom blocks in SFC. We'll plan to support it in the future.
:::

これまで説明したコードは、[example](https://github.com/intlify/vue-i18n-next/tree/master/examples/type-safe) として公開しています。実際に確認してみましょう！

### Type-Safe supporting APIs
他にも、以下のAPIに対して、型安全なリソースの操作ができるようリソースのスキーマを指定できる型パラメータをサポートしています。

- `getLocaleMessage`
- `setLocaleMessage`
- `mergeLocaleMessage`
- `getDateTimeFormat`
- `setDateTimeFormat`
- `mergeDateTimeFormat`
- `getNumberFormat`
- `setNumberFormat`
- `mergeNumberFormat`

詳しくは、これらの以下のAPIドキュメントのページで確認してください。

- [Legacy API](https://vue-i18n.intlify.dev/api/legacy)
- [Composition API](https://vue-i18n.intlify.dev/api/composition)

## Resource Keys completion supporting

:::warning NOTICE
Resource Keys completion can be used if you are using [Visual Studio Code](https://code.visualstudio.com/)
:::

型安全なリソースの定義のサポートのとともに、VueI18n が提供する Composition API の `t` 、`d`といったAPIでリソースキーの補間ができるようになりました。

以下は、上記で説明した local scope な Vue コンポーネントでの、Visual Stdio Code 上で Resource keys を補間する様子です。

![VSCode-Resource-Completion](/ts-support-3.gif)

Resource Keys の補間のサポートにより、translation missingを防ぐことができます。

あなたのプロジェクトによっては、Vueコンポーネントで local scope を使わず、すべて global scope を使用している場合があるでしょう。

そのユースケースにおいても、`useI18n` の型パラメータに、global scope 向けに定義したスキーマを明示的に指定することで、Resource keys の補間をサポートすることができます。

そのユースケースの場合は、以下のように、global scope向けスキーマを定義し、
define schema for global scope:
```ts
/**
 * define the resource schema
 */

import enUS from './en-US.json'

// define message schema as master mesage schema
export type MessageSchema = typeof enUS

// define number format schema
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
```

そして、以下のVueコンポーネントのように、 定義したスキーマをimport して `useI18n` の型パラメータに指定して使うだけです:
```html
<template>
  <p>message: {{ t('hello') }}</p>
  <p>currecy: {{ n(1000, 'currency') }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// import resource schema for global scope
import type { MessageSchema, NumberSchema } from '../locales/schema'

// define Vue component
export default defineComponent({
  setup() {
    const { t, n } = useI18n<{ message: MessageSchema, number: NumberSchema }>({
      useScope: 'global'
    })
    return { t, n }
  }
})
</script>
```

これにより、`t`、`n` といった VueI18nが提供する API で resource keys の補間を得ることができます。

:::warning NOTICE
Legacy Mode 、そして、Composition API の`globalInjection: true`による、Componentへインジェクションされる`$t`や`$d`などのAPIの Resource Keys の補間は、明示的に型パラメーターの指定が必要です。

詳しくは、APIドキュメントを参照してください。
https://vue-i18n.intlify.dev/api/injection.html
:::

## グローバルなリソーススキーマ定義

VueI18nでは、TypeScriptのinterfaceを拡張できる機能を利用して、global scope レベルでリソースの型定義することができます。

あなたのプロジェクトにおいて、リソースを全てglobal scopeとして利用する場合は、簡単にtype-safeなリソースを扱うことができるため大変便利です。

VueI18nでは以下のinterfaceを提供しています。

- `DefineLocaleMessage`: Locale messages のスキーマをグローバルに定義するための interface 
- `DefineDateTimeFormat`: Datetime formats のスキーマをグローバルに定義するための interface
- `DefineNumberFormat`: Number formats のスキーマをグローバルに定義するための interface

これらの interfaces と `declare module` を使うことによって、VueI18nにグローバルなスキーマを定義することができます。

以下は、`d.ts` に定義したグローバルスキーマの例です:

```ts
/**
 * you need to import the some interfaces
 */
import {
  DefineLocaleMessage,
  DefineDateTimeFormat,
  DefineNumberFormat
} from 'vue-i18n'

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage {
    hello: string
    menu: {
      login: string
    }
    errors: string[]
  }

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric'
      minute: 'numeric'
      second: 'numeric'
      timeZoneName: 'short'
      timezone: string
    }
  }

  // define the number format schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
```

`declare module` と VueI18n が提供している interface を利用することで、グローバルリソースのスキーマを定義することができます。

これまれでの説明で、`createI18n`そして`useI18n`にglobal scope リソースに対して型定義して利用する場合、それぞれに型パラメータとして指定する必要がありました。
この方法では、その必要がなくなります。

以下は、`createI18n`での例です。

```ts
import { createI18n } from 'vue-i18n'

/**
 * import locale messages resoruce from json for global scope
 */
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

/**
 * setup vue-i18n with i18n resources with global type definition.
 * if you define the i18n resource schema in your `*.d.ts`, these is checked with typeScript.
 */
const i18n = createI18n<false>({
  legacy: false,
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'ja-JP': jaJP
  },
  datetimeFormats: {
    'ja-JP': {
      short: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timezone: 'Asia/Tokyo'
      }
    }
  },
  numberFormats: {
    'ja-JP': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'JPY'
      }
    }
  }
})
```

上記の`createI18n`の型パラメータには、リソースのスキーマとなる型が指定されていません。上記では、`createI18n`で生成されたi18nインスタンスの`global`プロパティの型のヒントを指定しているだけです。
(`false`の場合は、Composition API向けの`Composer`インスタンス、`true`の場合は、legacy API向けの`VueI18n`インスタンスの型になります。)

Vueコンポーネントで使用する`useI18n`のケースの場合は以下のようになります。

```html
<template>
  <p>`t` resource key completion: {{ t('menu.login') }}</p>
  <p>`d` resource key completion: {{ d(new Date(), 'short') }}</p>
  <p>`n` resource key completion: {{ n(1000, 'currency') }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    // use global scope
    const { t, d, n } = useI18n({
      inheritLocale: true
    })
    return { t, d, n }
  }
})
</script>
```

上記のコードから分かるとおり、`useI18n`の型パラメータに何も指定する必要はありません。指定しなくても、`t`、`d`、そして`n`などAPIの Resource Keys の補間ができます。
