# カスタムメッセージフォーマット

:::tip Supported Versions
:new: 9.3+
:::

[メッセージフォーマット構文で説明したように](../essentials/syntax)、Vue I18n メッセージフォーマットは独自仕様です。

ICU メッセージフォーマットのようなメッセージフォーマットを使用したい場合は、メッセージコンパイラを自分で実装することでカスタムフォーマットを使用できます。

:::warning
このトピックでは、Vue I18n メッセージフォーマットのコンパイルと、フォーマットがどのように解決されるかを理解する必要があります。
:::

:::warning
この機能は実験的です。将来的に破壊的な変更が行われたり、削除されたりする可能性があります。
:::

## メッセージコンパイラの実装

以下のインターフェースを持つ関数を実装することで、メッセージコンパイラを作成できます。

以下は TypeScript の型定義です：
```ts
export declare type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

以下は、[`intl-messageformat`](https://formatjs.io/docs/intl-messageformat/) を使用して ICU メッセージフォーマットをサポートするメッセージコンパイラの実装例です。

```ts
import IntlMessageFormat from 'intl-messageformat'

import type { MessageCompiler, CompileError, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === 'string') {
    /**
     * キャッシュ戦略やメモ化を使用して、メッセージコンパイラのパフォーマンスをさらに調整できます
     */
    const formatter = new IntlMessageFormat(message, locale)
    return (ctx: MessageContext) => {
      return formatter.format(ctx.values)
    }
  } else {
    /**
     * AST 用。
     * サポートしたい場合は、
     * バンドルプラグインを使用して `json`、`yaml` などのロケールメッセージを変換する必要があります。
     */
    onError && onError(new Error('not support for AST') as CompileError)
    return () => key
  }
}
```

## メッセージコンパイラの登録

メッセージコンパイラを実装した後、以下のように `createI18n` の `messageCompiler` オプションを設定すると、`messages` オプションに独自のメッセージフォーマットを使用できます：

<!-- eslint-skip -->

```ts
import { createI18n } from 'vue-i18n'
import { messageCompiler } from './compilation'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messageCompiler,
  messages: {
    en: {
      hello: 'hello world!',
      greeting: 'hi, {name}!',
      photo: `You have {numPhotos, plural,
        =0 {no photos.}
        =1 {one photo.}
        other {# photos.}
      }`
    }
  }
})

// 以下で何かを行う ...
// ...
```

## 参照

メッセージコンパイラを実装する際には、[コンパイルコード](https://github.com/intlify/vue-i18n/blob/master/packages/core-base/src/compilation.ts) を読んで理解することをお勧めします

:::info
以下のチュートリアルのコードは [examples/message-format](https://github.com/intlify/vue-i18n/tree/master/examples/message-format) で入手できます。
:::
