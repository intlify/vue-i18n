# Custom Message Format

:::tip Supported Versions
:new: 9.3+
:::

[As described in the message format syntax](../essentials/syntax), Vue I18n message format is original.

If you want to use a message format like ICU Message Format, you can use a custom format by implementing the message compiler yourself.


:::warning
This topic requires understanding Vue I18n message format compilation and how formats are resolved.
:::

:::warning
The feature is experimental. It may receive breaking changes or be removed in the future.
:::


## Message Compiler implementation

You can make a message compiler by implementing functions with the following interfaces.

The following is a TypeScript type definition:
```js
export declare type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

The following is an example of a message compiler implementation that uses [`intl-messageformat`](https://formatjs.io/docs/intl-messageformat/) to support the ICU Message format.


```ts
import IntlMessageFormat from 'intl-messageformat'

import type { MessageCompiler, CompileError, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === 'string') {
    /**
     * You can tune your message compiler performance more with your cache strategy or also memoization at here
     */
    const formatter = new IntlMessageFormat(message, locale)
    return (ctx: MessageContext) => {
      return formatter.format(ctx.values)
    }
  } else {
    /**
     * for AST.
     * If you would like to support it,
     * You need to transform locale messages such as `json`, `yaml`, etc. with the bundle plugin.
     */
    onError && onError(new Error('not support for AST') as CompileError)
    return () => key
  }
}
```

## Message compiler registration

After implementing message compiler, set the `messageCompiler` option of `createI18n` as follows, and you can use your message format for the `messages` option:

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

// the below your something to do ...
// ...
```

## Reference

In implementing the message compiler, we recommend you would read and understand the [compilation codes](https://github.com/intlify/vue-i18n-next/blob/master/packages/core-base/src/compilation.ts)

:::info
You can get the code for the tutorial below on [examples/message-format](https://github.com/intlify/vue-i18n-next/tree/master/examples/message-format).
:::
