:::warning v11 文档
这是 **Vue I18n v11** 的文档。如果您使用的是 v12 或更高版本，请参阅 [最新指南](/zh/guide/essentials/started)。
:::

# 消息格式语法

Vue I18n 可以使用消息格式语法来本地化 UI 中显示的消息。Vue I18n 消息包括插值和具有各种特性语法的消息。

## 插值

Vue I18n 支持使用占位符 `{}` 进行插值，类似于 "Mustache"。

### 具名插值

具名插值可以使用 JavaScript 中定义的变量名在占位符中进行插值。

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    message: {
      hello: '{msg} world'
    }
  }
}
```

该语言环境消息是通过 `createI18n` 的 `messages` 选项指定的资源。它定义了 `en` 语言环境，内容为 `{ message: { hello: '{msg} world' } }`。

具名插值允许你指定 JavaScript 中定义的变量。在上面的语言环境消息中，你可以通过将 JavaScript 定义的 `msg` 作为参数传递给翻译函数来进行本地化。

`{}` 内的变量名必须以字母 (a-z, A-Z) 或下划线 (`_`) 开头，后跟字母、数字、下划线 (`_`)、连字符 (`-`) 或美元符号 (`$`) 的任意组合。

示例：`{msg}`, `{_userName}`, `{user-id}`, `{total$}`

以下是在模板中使用 `$t` 的示例：

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

第一个参数是 `message.hello`，作为语言环境消息键值，第二个参数是一个对象，包含 `msg` 属性作为 `$t` 的参数。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> 翻译函数的语言环境消息资源键，可以使用 `.` (点) 指定特定的资源命名空间，就像 JavaScript 访问对象一样。

> [!TIP]
> `$t` 有一些重载。关于这些重载，请参阅 [API 参考](/api/vue/interfaces/ComponentCustomProperties.md#t)

<!-- eslint-enable markdown/no-missing-label-refs -->

结果如下：

```html
<p>hello world</p>
```

### 列表插值

列表插值可以使用 JavaScript 中定义的数组在占位符中进行插值。

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    message: {
      hello: '{0} world'
    }
  }
}
```

它定义了 `en` 语言环境，内容为 `{ message: { hello: '{0} world' } }`。

列表插值允许你指定 JavaScript 中定义的数组。在上面的语言环境消息中，你可以通过将 JavaScript 定义的数组的索引 `0` 的项作为参数传递给翻译函数来进行本地化。

以下是在模板中使用 `$t` 的示例：

```html
<p>{{ $t('message.hello', ['hello']) }}</p>
```

第一个参数是 `message.hello` 作为语言环境消息键，第二个参数是一个包含 `'hello'` 项的数组作为 `$t` 的参数。

结果如下：

```html
<p>hello world</p>
```

### 字面量插值

字面量插值可以使用字面量字符串在占位符中进行插值。

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    address: "{account}{'@'}{domain}"
  }
}
```

它定义了 `en` 语言环境，内容为 `{ address: "{account}{'@'}{domain}" }`。

字面量插值允许你指定用单引号 `’` 括起来的字符串字面量。使用字面量插值指定的消息将**作为字符串**由翻译函数进行本地化。

以下是在模板中使用 `$t` 的示例：

```html
<p>email: {{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
```

第一个参数是 `address` 作为语言环境消息键，第二个参数是一个对象，包含 `account` 和 `domain` 属性作为 `$t` 的参数。

结果如下：

```html
<p>email: foo@domain.com</p>
```

:::tip 注意
字面量插值对于消息格式语法中的特殊字符（如 `{` 和 `}`）非常有用，这些字符不能直接在消息中使用。
:::

## 链接消息

如果有一个语言环境消息键总是具有与另一个键相同的具体文本，你可以直接链接到它。

要链接到另一个语言环境消息键，只需在其内容前加上 *`@:key`* 符号，后跟你要链接到的语言环境消息键的全名（包括命名空间）。

语言环境消息如下：

```js
const messages = {
  en: {
    message: {
      the_world: 'the world',
      dio: 'DIO:',
      linked: '@:message.dio @:message.the_world !!!!'
    }
  }
}
```

这是一个对象中具有层级结构的 `en` 语言环境。

`message.the_world` 有 `the world`，`message.dio` 有 `DIO:`。`message.linked` 有 `@:message.dio @:message.dio @:message.the_world !!!!`，它链接到了 `message.dio` 和 `message.the_world` 语言环境消息键。

以下是在模板中使用 `$t` 的示例：

```html
<p>{{ $t('message.linked') }}</p>
```

第一个参数是 `message.linked` 作为语言环境消息键作为 `$t` 的参数。

结果如下：

```html
<p>DIO: the world !!!!</p>
```

### 内置修饰符

如果语言区分字符的大小写，你可能需要控制链接的语言环境消息的大小写。
链接消息可以使用修饰符 *`@.modifier:key`* 进行格式化。

目前可用的内置修饰符如下：

* `upper`: 将链接消息中的所有字符转换为大写
* `lower`: 将链接消息中的所有字符转换为小写
* `capitalize`: 将链接消息中的第一个字符大写

语言环境消息如下：

```js
const messages = {
  en: {
    message: {
      homeAddress: 'Home address',
      missingHomeAddress: 'Please provide @.lower:message.homeAddress'
    }
  }
}
```

这是一个对象中具有层级结构的 `en` 语言环境。

`message.homeAddress` 有 `Home address`。`message.missingHomeAddress` 有 `Please provide @.lower:message.homeAddress`，它链接到了 `message.homeAddress` 语言环境消息键。

由于在上面的示例中指定了修饰符 `.lower`，所以链接的 `message.homeAddress` 键被解析后，会对其进行求值。

以下是在模板中使用 `$t` 的示例：

```html
<label>{{ $t('message.homeAddress') }}</label>
<p class="error">{{ $t('message.missingHomeAddress') }}</p>
```

结果如下：

```html
<label>Home address</label>
<p class="error">Please provide home address</p>
```

### 自定义修饰符

如果你想使用非内置修饰符，你可以使用自定义修饰符。

要使用自定义修饰符，你必须在 `createI18n` 的 `modifiers` 选项中指定它们：

```js
const i18n = createI18n({
  locale: 'en',
  messages: {
    // 设置一些语言环境消息 ...
  },
  // 在 `modifiers` 选项中设置自定义修饰符
  modifiers: {
    snakeCase: (str) => str.split(' ').join('_')
  }
})
```

语言环境消息如下：

```js
const messages = {
  en: {
    message: {
      snake: 'snake case',
      custom_modifier: "custom modifiers example: @.snakeCase:{'message.snake'}"
    }
  }
}
```

这是一个对象中具有层级结构的 `en` 语言环境。

`message.snake` 有 `snake case`。`message.custom_modifier` 有 `custom modifiers example: @.snakeCase:{'message.snake'}`，它链接到了语言环境消息键，并使用字面量进行了插值。

:::tip 注意
你可以将插值（具名、列表和字面量）用于如下所示的链接消息的键。
:::


此示例展示了修饰符（`@.lower`、`@.upper`、`@.capitalize`）与具名、列表和字面量插值的组合使用。


```js
const messages = {
  en: {
    message: {
      greeting: "Hello, @.lower:{'message.name'}! You have {count} new messages.",
      name:"{name}"
    },

    welcome: "Welcome, @.upper:{'name'}! Today is @.capitalize:{'day'}.",
    name: '{0}',
    day: '{1}',

    literalMessage: "This is an email: foo{'@'}@.lower:domain",
    domain: 'SHOUTING'
  }
}
```
### 带修饰符的具名插值

在 `message.greeting` 中，我们对 `{count}` 使用了具名插值，并链接到 `message.name`，应用了 `.lower` 修饰符。

键 `message.name` 包含 `{name}`，它将使用传递的 `name` 参数进行插值。

`message.greeting` 链接到了语言环境消息键 `message.name`。

```html
<p>{{ $t('message.greeting', { name: 'Alice', count: 5 }) }}</p>
```
结果如下：

```html
<p>Hello, alice! You have 5 new messages.</p>
```

### 带修饰符的列表插值

在这种情况下，`{0}` 和 `{1}` 的值作为数组传递。键 `name` 和 `day` 使用列表插值解析，并使用修饰符进行转换。

```html
<p>{{ $t('welcome', ['bob', 'MONDAY']) }}</p>
```

结果如下：

```html
<p>Welcome, BOB! Today is Monday.</p>
```

### 带修饰符的字面量插值

在这个例子中，我们在消息中使用了字面量字符串，并应用了 `.lower` 修饰符。

```html
<p>{{ $t('literalMessage') }}</p>
```

在这里，修饰符应用于 `domain` 内的内容，`@` 作为字面量输出保留。

结果如下：

```html
<p>This is an email: foo@shouting</p>
```

## 特殊字符 (Special Characters)

消息格式语法中使用的以下字符由编译器作为特殊字符处理：

- `{`
- `}`
- `@`
- `$`
- `|`

如果你想使用这些字符，你可以使用 [字面量插值](#字面量插值) 或 **转义序列**。

### 转义序列

:::tip 注意
转义序列从 v12 开始支持。
:::

你可以使用反斜杠 (`\`) 前缀来转义特殊字符，类似于 C 语言的转义序列：

| 转义 | 结果 | 描述 |
|------|------|------|
| `\{` | `{` | 字面量左大括号 |
| `\}` | `}` | 字面量右大括号 |
| `\@` | `@` | 字面量 @ 符号 |
| `\|` | `\|` | 字面量管道符 |
| `\\` | `\` | 字面量反斜杠 |

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    address: '{account}\\@{domain}',
    braces: 'hello \\{world\\}',
    choices: 'option A \\| option B'
  }
}
```

以下是在模板中使用 `$t` 的示例：

```html
<p>{{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
<p>{{ $t('braces') }}</p>
<p>{{ $t('choices') }}</p>
```

结果如下：

```html
<p>foo@domain.com</p>
<p>hello {world}</p>
<p>option A | option B</p>
```

:::tip 注意
如果反斜杠后面跟的不是特殊字符，则反斜杠将被视为字面量反斜杠。例如，消息中的 `\n` 将保持为 `\n`（反斜杠 + n），而不是换行符。
:::

## Rails i18n 格式

Vue I18n 支持与 [Ruby on Rails i18n](https://guides.rubyonrails.org/i18n.html) 兼容的消息格式。

你可以使用 `%` 前缀进行消息格式语法插值：

:::danger 重要
在 v10 及更高版本中，Rails i18n 格式将被弃用。我们建议使用具名插值。
:::

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    message: {
      hello: '%{msg} world'
    }
  }
}
```

它定义了 `en` 语言环境，内容为 `{ message: { hello: '%{msg} world' } }`。

与 [具名插值](#具名插值) 一样，你可以指定 JavaScript 中定义的变量。在上面的语言环境消息中，可以通过将 JavaScript 定义的 `msg` 作为参数传递给翻译函数来进行本地化。

以下是在模板中使用 `$t` 的示例：

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

结果如下：

```html
<p>hello world</p>
```

## HTML 消息

你可以本地化包含 HTML 的消息。

:::danger 危险
:warning: 在你的网站上动态本地化任意 HTML 可能非常危险，因为它很容易导致 XSS 漏洞。仅在受信任的内容上使用 HTML 插值，切勿在用户提供的内容上使用。

我们建议使用 [组件插值](../advanced/component)。
:::

:::warning 注意
如果消息包含 HTML，Vue I18n 在开发模式下 (`process.env`<wbr/>`.NODE_ENV !== 'production'`) 会向控制台输出警告。

你可以使用 `createI18n` 或 `useI18n` 中的 `warnHtmlInMessage` 或 `warnHtmlMessage` 选项来控制警告输出。
:::

例如，以下语言环境消息资源：

```js
const messages = {
  en: {
    message: {
      hello: 'hello <br> world'
    }
  }
}
```

它定义了 `en` 语言环境，内容为 `{ message: { hello: 'hello <br> world' } }`。

以下是在模板中使用 `v-html` 和 `$t` 的示例：

```html
<p v-html="$t('message.hello')"></p>
```

结果如下：

```html
<p>hello
<!--<br> exists but is rendered as html and not a string-->
world</p>
```