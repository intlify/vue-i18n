# TypeScript サポート

:::tip Supported Versions
:new: 9.2+
:::

VueI18n は、ロケールメッセージ、日時フォーマット、数値フォーマットなどのリソースを使用します。
特に、ロケールメッセージは、ローカリゼーションサービスを使用する翻訳者と連携するために、`json` ファイルなどの i18n リソースとして外部化でき、これらのリソースを連携のためにインポートできます。

ローカリゼーションサービスと連携したスムーズなローカリゼーションワークフローを実現するために、外部化された i18n リソースのローカリゼーションの欠落やリソース定義の欠落を防ぎたい場合があります。
また、開発中は、`$t` のような翻訳関数を使用する際のキー文字列の間違いを防ぐことで、開発者体験を損なわないようにしたい場合があります。

## スキーマを使用した型安全なリソース

TypeScript を使用して、リソーススキーマを持つ型安全なリソースをサポートできます。

### `createI18n` での型安全なリソース

以下は、`createI18n` オプションで定義された `messages` の型安全なリソースを定義するためのコード例です。

ロケールメッセージリソース：

```json
{
  "world": "the world!"
}
```

アプリケーションエントリポイント：

<!-- eslint-skip -->

```ts
import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'

// リソースのマスタースキーマとして 'en-US' を型定義
type MessageSchema = typeof enUS

const i18n = createI18n<[MessageSchema], 'en-US' | 'ja-JP'>({
  locale: 'en-US',
  messages: {
    'en-US': enUS
  }
})
```

上記のコードは、`createI18n` の `messages` オプションで指定された `en-US` メッセージリソースから型を定義します。この定義された型は、VueI18n で処理されるメッセージリソースのマスターのようなスキーマです。これは、アプリケーション内で **信頼できる唯一の情報源** リソースとして定義できることを意味します。メッセージリソースからスキーマとして定義された型を `createI18n` の型パラメータの最初の引数として指定することで、他のロケールで型安全なリソースを定義できます。

`createI18n` の型パラメータの 2 番目の引数は、処理するロケールです。これにより、最初の引数で指定されたリソースの型に基づいて、2 番目の引数で指定された各ロケールに対して型チェックが実行されます。上記のコード例では、`en-US` と `ja-JP` がメインロケールとして指定されており、これらは `locale` オプションでも指定されています。この状態で typescript をコンパイルすると、`messages` オプションに `ja-JP` リソースが定義されていないことを確認するための以下のエラーが表示されます。

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

エディタとして [Visual Studio Code](https://code.visualstudio.com/) を使用している場合は、typescript コンパイルを実行する前に、以下のエラーでエディタにリソース定義の欠落があることに気付くことができます。

![VSCode-Type-Error1](/ts-support-1.png)
![VSCode-Type-Error2](/ts-support-2.png)

### `useI18n` での型安全なリソース

型安全なリソースは、`createI18n` だけでなく、Composition API で使用される `useI18n` を使用してコンポーネントごとに定義することもできます。

ローカルメッセージに加えて、リソース型定義には日時フォーマットと数値フォーマットも含めることができます。

以下は、`useI18n` でコンポーネントごとにロケールメッセージと数値フォーマットの型安全なリソースを定義するコードの例です。

Vue コンポーネントにインポートするロケールメッセージ：

```json
{
  "messages": {
    "hello": "Hello, {name}!"
  }
}
```

型安全なリソースを持つ Vue コンポーネント：

<!-- eslint-skip -->

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import enUS from './en-US.json' // Vue コンポーネント用のロケールメッセージをインポート

// Vue コンポーネント用のメッセージスキーマを定義
type MessageSchema = typeof enUS

// Vue コンポーネント用の数値フォーマットスキーマを定義
type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}

/*
 * 最初の型パラメータでオブジェクトリテラルを使用して定義スキーマを指定できます
 * 型パラメータについては、http://vue-i18n.intlify.dev/api/composition.html#usei18n を参照してください
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
</script>

<template>
  <p>message: {{ t('messages.hello', { name: 'kazupon' }) }}</p>
  <p>currency: {{ n(1000, 'currency') }}</p>
</template>
```

上記のコードでは、定義されたスキーマを `useI18n` の最初の型パラメータとして指定することで、TypeScript を使用してロケールメッセージと数値フォーマットの未定義リソースをチェックできます。また、2 番目の型パラメータで定義するロケールを指定することで、TypeScript は未定義のロケールをチェックできます。

:::warning Limitation
- SFC の i18n カスタムブロックでは型安全性はサポートされていません。将来的にサポートする予定です。
- 現在は `JSON` 形式のみサポートされています。
:::

これまでに説明したコードは [example](https://github.com/intlify/vue-i18n/tree/master/examples/type-safe) として入手できます。確認してみましょう！

### 型安全サポート API

他の API は、以下のような型安全なリソース操作のためにリソースのスキーマを指定できる型パラメータをサポートしています：

- `getLocaleMessage`
- `setLocaleMessage`
- `mergeLocaleMessage`
- `getDateTimeFormat`
- `setDateTimeFormat`
- `mergeDateTimeFormat`
- `getNumberFormat`
- `setNumberFormat`
- `mergeNumberFormat`

詳細については、以下の API ドキュメントページを確認してください。

- [Legacy API](https://vue-i18n.intlify.dev/api/legacy)
- [Composition API](https://vue-i18n.intlify.dev/api/composition)

## リソースキー補完サポート

:::warning NOTICE
[Visual Studio Code](https://code.visualstudio.com/) を使用している場合は、リソースキー補完を使用できます
:::

型安全なリソース定義のサポートに加えて、VueI18n は Composition API でリソースキーを補間するための `t` や `d` などの API を提供するようになりました。

以下は、上記のローカルスコープ Vue コンポーネントの Visual Studio Code でリソースキーを補間する方法を示しています。

![VSCode-Resource-Completion](/ts-support-3.gif)

リソースキーの補間のサポートにより、翻訳の欠落を防ぐことができます。

プロジェクトのユースケースでは、ローカルスコープを使用せず、すべてにグローバルスコープを使用する Vue コンポーネントがある場合があります。

そのユースケースでは、`useI18n` の型パラメータでグローバルスコープ用に定義されたスキーマを明示的に指定することで、リソースキーの補間をサポートすることもできます。

グローバルスコープのスキーマを定義：

<!-- eslint-skip -->

```ts
/**
 * リソーススキーマを定義
 */

import enUS from './en-US.json'

// メッセージスキーマをマスターメッセージスキーマとして定義
export type MessageSchema = typeof enUS

// 数値フォーマットスキーマを定義
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
```

次に、以下の Vue コンポーネントのように、定義されたスキーマをインポートして `useI18n` の型パラメータとして使用するだけです：

<!-- eslint-skip -->

```vue
<script lang="ts">
import { useI18n } from 'vue-i18n'

// グローバルスコープのリソーススキーマをインポート
import type { MessageSchema, NumberSchema } from '../locales/schema'

const { t, n } = useI18n<{ message: MessageSchema, number: NumberSchema }>({
  useScope: 'global'
})
</script>

<template>
  <p>message: {{ t('hello') }}</p>
  <p>currency: {{ n(1000, 'currency') }}</p>
</template>

```

その結果、`t` や `n` などの VueI18n が提供する API でリソースキーの補間を使用できます。

:::warning NOTICE
レガシーモード、および Composition API の `globalInjection: true` によってコンポーネントに注入される `$t` や `$d` などの API のリソースキーの補間には、型パラメータを明示的に指定する必要があります。

詳細については、API ドキュメントを参照してください。
https://vue-i18n.intlify.dev/api/injection.html
:::

## グローバルリソーススキーマ型定義

VueI18n では、TypeScript 機能を使用してインターフェースを拡張することで、グローバルスコープレベルでリソース型を定義できます。

プロジェクトですべてのリソースをグローバルスコープとして使用する場合、型安全なリソースを簡単に処理するのに非常に便利です。

VueI18n は以下のインターフェースを提供します：

- `DefineLocaleMessage`: ロケールメッセージのスキーマをグローバルに定義するインターフェース
- `DefineDateTimeFormat`: 日時フォーマットのスキーマをグローバルに定義するインターフェース
- `DefineNumberFormat`: 数値フォーマットのスキーマをグローバルに定義するインターフェース

これらのインターフェースと `declare module` を使用することで、VueI18n のグローバルスキーマを定義できます。

以下は、`d.ts` で定義されたグローバルスキーマの例です：

```ts
/**
 * いくつかのインターフェースをインポートする必要があります
 */



declare module 'vue-i18n' {
  // ロケールメッセージスキーマを定義
  export interface DefineLocaleMessage {
    hello: string
    menu: {
      login: string
    }
    errors: string[]
  }

  // 日時フォーマットスキーマを定義
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric'
      minute: 'numeric'
      second: 'numeric'
      timeZoneName: 'short'
      timezone: string
    }
  }

  // 数値フォーマットスキーマを定義
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
```

`declare module` と VueI18n が提供するインターフェースを使用することで、グローバルリソースのスキーマを定義できます。

以前は、グローバルスコープリソースの型定義で `createI18n` と `useI18n` を使用する場合、それぞれを型パラメータとして指定する必要がありました。
この方法では、それを行う必要はありません。

以下は `createI18n` の例です：

<!-- eslint-skip -->

```ts
import { createI18n, type I18nOptions } from 'vue-i18n'

/**
 * グローバルスコープ用に json からロケールメッセージリソースをインポート
 */
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

const options: I18nOptions = {
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
}

/**
 * グローバル型定義を持つ i18n リソースで vue-i18n を設定します。
 * `*.d.ts` で i18n リソーススキーマを定義すると、これらは typeScript でチェックされます。
 */
const i18n = createI18n<false, typeof options>(options)
```

上記の `createI18n` の最初の型パラメータは、リソースのスキーマである型を指定しません。上記は、`createI18n` によって作成された i18n インスタンスの `global` プロパティの型ヒントを指定しているだけです。
（`false` の場合、型は Composition API の `Composer` インスタンスであり、`true` の場合、型は Legacy API の `VueI18n` インスタンスです）

`createI18n` の 2 番目の型パラメータは、オプションの型ヒントを指定します。

Vue コンポーネントが `useI18n` を使用する場合、以下のようになります：

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// グローバルスコープを使用
const { t, d, n } = useI18n({
  inheritLocale: true
})
</script>

<template>
  <p>`t` resource key completion: {{ t('menu.login') }}</p>
  <p>`d` resource key completion: {{ d(new Date(), 'short') }}</p>
  <p>`n` resource key completion: {{ n(1000, 'currency') }}</p>
</template>
```

上記のコードからわかるように、`useI18n` の型パラメータに何も指定する必要はありません。指定しなくても、`t`、`d`、`n` などの API リソースキーを補間できます。
