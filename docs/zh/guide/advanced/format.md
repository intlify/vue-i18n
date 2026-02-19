# 自定义消息格式

:::tip 支持的版本
:new: 9.3+
:::

[如消息格式语法中所述](../essentials/syntax)，Vue I18n 消息格式是原创的。

如果你想使用像 ICU 消息格式这样的消息格式，你可以通过自己实现消息编译器来使用自定义格式。

:::warning
本主题需要了解 Vue I18n 消息格式编译以及格式是如何解析的。
:::

:::warning
该功能是实验性的。它可能会在未来收到重大更改或被删除。
:::

## 消息编译器实现

你可以通过实现具有以下接口的函数来制作消息编译器。

以下是 TypeScript 类型定义：
```ts
export declare type MessageCompiler<Message = string, MessageSource = string | ResourceNode> = (message: MessageSource, context: MessageCompilerContext) => MessageFunction<Message>;
```

以下是使用 [`intl-messageformat`](https://formatjs.io/docs/intl-messageformat/) 支持 ICU 消息格式的消息编译器实现示例。

```ts
import IntlMessageFormat from 'intl-messageformat'

import type { MessageCompiler, CompileError, MessageContext } from 'vue-i18n'

export const messageCompiler: MessageCompiler = (
  message,
  { locale, key, onError }
) => {
  if (typeof message === 'string') {
    /**
     * 你可以通过缓存策略或记忆化来进一步调整消息编译器的性能
     */
    const formatter = new IntlMessageFormat(message, locale)
    return (ctx: MessageContext) => {
      return formatter.format(ctx.values)
    }
  } else {
    /**
     * 对于 AST。
     * 如果你想支持它，
     * 你需要使用打包插件转换语言环境消息，如 `json`、`yaml` 等。
     */
    onError && onError(new Error('not support for AST') as CompileError)
    return () => key
  }
}
```

## 消息编译器注册

实现消息编译器后，如下设置 `createI18n` 的 `messageCompiler` 选项，你可以为 `messages` 选项使用你的消息格式：

<!-- eslint-skip -->

```ts
import { createI18n } from 'vue-i18n'
import { messageCompiler } from './compilation'

const i18n = createI18n({
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

// 下面做一些事情 ...
// ...
```

## 参考

在实现消息编译器时，我们建议你阅读并理解 [编译代码](https://github.com/intlify/vue-i18n/blob/master/packages/core-base/src/compilation.ts)

:::info
你可以在 [examples/message-format](https://github.com/intlify/vue-i18n/tree/master/examples/message-format) 上获取下面教程的代码。
:::
