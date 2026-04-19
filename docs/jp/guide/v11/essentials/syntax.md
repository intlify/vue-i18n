:::warning v11 ドキュメント
これは **Vue I18n v11** のドキュメントです。v12 以降を使用している場合は、[最新のガイド](/jp/guide/essentials/started) を参照してください。
:::

# メッセージフォーマット構文

Vue I18n は、UI に表示されるメッセージをローカライズするためにメッセージフォーマット構文を使用できます。Vue I18n メッセージは、補間とさまざまな機能構文を持つメッセージです。

## 補間

Vue I18n は、"Mustache" のようなプレースホルダー `{}` を使用した補間をサポートしています。

### 名前付き補間

名前付き補間は、JavaScript で定義された変数名を使用してプレースホルダーに補間できます。

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    message: {
      hello: '{msg} world'
    }
  }
}
```

ロケールメッセージは、`createI18n` の `messages` オプションで指定されたリソースです。これは、`{ message: { hello: '{msg} world' } }` で `en` ロケールを定義しています。

名前付き補間では、JavaScript で定義された変数を指定できます。上記のロケールメッセージでは、JavaScript で定義された `msg` を翻訳関数のパラメータとして与えることでローカライズできます。

`{}` 内の変数名は、文字 (a-z, A-Z) またはアンダースコア (`_`) で始まり、その後に文字、数字、アンダースコア (`_`)、ハイフン (`-`)、またはドル記号 (`$`) の任意の組み合わせが続く必要があります。

例：`{msg}`, `{_userName}`, `{user-id}`, `{total$}`

以下は、テンプレートでの `$t` の使用例です：

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

最初の引数はロケールメッセージキーとしての `message.hello` で、2 番目の引数は `$t` へのパラメータとしての `msg` プロパティを持つオブジェクトです。

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!TIP]
> 翻訳関数のロケールメッセージリソースキーは、JavaScript オブジェクトのように `.` (ドット) を使用して特定のリソース名前空間を指定できます。

> [!TIP]
> `$t` にはいくつかのオーバーロードがあります。これらのオーバーロードについては、[API リファレンス](/api/vue/interfaces/ComponentCustomProperties.md#t) を参照してください。

<!-- eslint-enable markdown/no-missing-label-refs -->

結果は以下のようになります：

```html
<p>hello world</p>
```

### リスト補間

リスト補間は、JavaScript で定義された配列を使用してプレースホルダーに補間できます。

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    message: {
      hello: '{0} world'
    }
  }
}
```

これは、`{ message: { hello: '{0} world' } }` で `en` ロケールを定義しています。

リスト補間では、JavaScript で定義された配列を指定できます。上記のロケールメッセージでは、JavaScript で定義された配列の `0` インデックスの項目を翻訳関数のパラメータとして与えることでローカライズできます。

以下は、テンプレートでの `$t` の使用例です：

```html
<p>{{ $t('message.hello', ['hello']) }}</p>
```

最初の引数はロケールメッセージキーとしての `message.hello` で、2 番目の引数は `$t` へのパラメータとして `'hello'` 項目を持つ配列です。

結果は以下のようになります：

```html
<p>hello world</p>
```

### リテラル補間

リテラル補間は、リテラル文字列を使用してプレースホルダーに補間できます。

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    address: "{account}{'@'}{domain}"
  }
}
```

これは、`{ address: "{account}{'@'}{domain}" }` で `en` ロケールを定義しています。

リテラル補間では、シングルクォーテーション `’` で囲まれた文字列リテラルを指定できます。リテラル補間で指定されたメッセージは、翻訳関数によって **文字列として** ローカライズされます。

以下は、テンプレートでの `$t` の使用例です：

```html
<p>email: {{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
```

最初の引数はロケールメッセージキーとしての `address` で、2 番目の引数は `$t` へのパラメータとしての `account` と `domain` プロパティを持つオブジェクトです。

結果は以下のようになります：

```html
<p>email: foo@domain.com</p>
```

:::tip NOTE
リテラル補間は、メッセージフォーマット構文の特殊文字（`{` や `}` など）をメッセージ内で直接使用できない場合に便利です。
:::

## リンクメッセージ

別のキーと常に同じ具体的なテキストを持つロケールメッセージキーがある場合、単にそれにリンクすることができます。

別のロケールメッセージキーにリンクするには、その内容の前に *`@:key`* 記号を付け、その後にリンクしたい名前空間を含むロケールメッセージキーの完全な名前を続けます。

ロケールメッセージは以下のようになります：

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

これは、オブジェクト内に階層構造を持つ `en` ロケールです。

`message.the_world` は `the world` を持ち、`message.dio` は `DIO:` を持ちます。`message.linked` は `@:message.dio @:message.dio @:message.the_world !!!!` を持ち、`message.dio` と `message.the_world` のロケールメッセージキーにリンクされています。

以下は、テンプレートでの `$t` の使用例です：

```html
<p>{{ $t('message.linked') }}</p>
```

最初の引数は、`$t` へのパラメータとしてのロケールメッセージキー `message.linked` です。

結果は以下のようになります：

```html
<p>DIO: the world !!!!</p>
```

### 組み込み修飾子

言語が文字の大文字と小文字を区別する場合、リンクされたロケールメッセージの大文字と小文字を制御する必要があるかもしれません。
リンクメッセージは、修飾子 *`@.modifier:key`* でフォーマットできます。

現在利用可能な組み込み修飾子は以下のとおりです。

* `upper`: リンクされたメッセージ内のすべての文字を大文字にする
* `lower`: リンクされたメッセージ内のすべての文字を小文字にする
* `capitalize`: リンクされたメッセージ内の最初の文字を大文字にする

ロケールメッセージは以下のようになります：

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

これは、オブジェクト内に階層構造を持つ `en` ロケールです。

`message.homeAddress` は `Home address` を持ちます。`message.missingHomeAddress` は `Please provide @.lower:message.homeAddress` を持ち、`message.homeAddress` のロケールメッセージキーにリンクされています。

上記の例では修飾子 `.lower` が指定されているため、リンクされた `message.homeAddress` キーが解決された後に評価されます。

以下は、テンプレートでの `$t` の使用例です：

```html
<label>{{ $t('message.homeAddress') }}</label>
<p class="error">{{ $t('message.missingHomeAddress') }}</p>
```

結果は以下のようになります：

```html
<label>Home address</label>
<p class="error">Please provide home address</p>
```

### カスタム修飾子

組み込み以外の修飾子を使用したい場合は、カスタム修飾子を使用できます。

カスタム修飾子を使用するには、`createI18n` の `modifiers` オプションで指定する必要があります：

```js
const i18n = createI18n({
  locale: 'en',
  messages: {
    // 何らかのロケールメッセージを設定 ...
  },
  // `modifiers` オプションでカスタム修飾子を設定
  modifiers: {
    snakeCase: (str) => str.split(' ').join('_')
  }
})
```

ロケールメッセージは以下のようになります：

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

これは、オブジェクト内に階層構造を持つ `en` ロケールです。

`message.snake` は `snake case` を持ちます。`message.custom_modifier` は `custom modifiers example: @.snakeCase:{'message.snake'}` を持ち、ロケールメッセージキーにリンクされ、リテラルで補間されます。

:::tip NOTE
以下に示すように、リンクメッセージのキーに補間（名前付き、リスト、リテラル）を使用できます。
:::


この例では、修飾子（`@.lower`、`@.upper`、`@.capitalize`）と名前付き、リスト、リテラル補間を組み合わせて使用しています。


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
### 修飾子付きの名前付き補間

`message.greeting` では、`{count}` に名前付き補間を使用し、`message.name` にリンクして `.lower` 修飾子を適用しています。

キー `message.name` には `{name}` が含まれており、渡された `name` パラメータで補間されます。

`message.greeting` はロケールメッセージキー `message.name` にリンクされています。

```html
<p>{{ $t('message.greeting', { name: 'Alice', count: 5 }) }}</p>
```
結果は以下のようになります：

```html
<p>Hello, alice! You have 5 new messages.</p>
```

### 修飾子付きのリスト補間

この場合、`{0}` と `{1}` の値は配列として渡されます。キー `name` と `day` はリスト補間を使用して解決され、修飾子で変換されます。

```html
<p>{{ $t('welcome', ['bob', 'MONDAY']) }}</p>
```

結果は以下のようになります：

```html
<p>Welcome, BOB! Today is Monday.</p>
```

### 修飾子付きのリテラル補間

この例では、メッセージ内でリテラル文字列を使用し、`.lower` 修飾子を適用しています。

```html
<p>{{ $t('literalMessage') }}</p>
```

ここで、修飾子は `domain` 内のコンテンツに適用され、`@` はリテラル出力として保持されます。

結果は以下のようになります：

```html
<p>This is an email: foo@shouting</p>
```

## 特殊文字

メッセージフォーマット構文で使用される以下の文字は、コンパイラによって特殊文字として処理されます：

- `{`
- `}`
- `@`
- `$`
- `|`

これらの文字を使用したい場合は、[リテラル補間](#リテラル補間) または **エスケープシーケンス** を使用できます。

### エスケープシーケンス

:::tip NOTE
エスケープシーケンスは v12 以降でサポートされます。
:::

C言語のエスケープシーケンスと同様に、バックスラッシュ (`\`) を前置することで特殊文字をエスケープできます：

| エスケープ | 結果 | 説明 |
|-----------|------|------|
| `\{` | `{` | リテラルの開き波括弧 |
| `\}` | `}` | リテラルの閉じ波括弧 |
| `\@` | `@` | リテラルのアットマーク |
| `\|` | `\|` | リテラルのパイプ |
| `\\` | `\` | リテラルのバックスラッシュ |

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    address: '{account}\\@{domain}',
    braces: 'hello \\{world\\}',
    choices: 'option A \\| option B'
  }
}
```

以下は、テンプレートでの `$t` の使用例です：

```html
<p>{{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
<p>{{ $t('braces') }}</p>
<p>{{ $t('choices') }}</p>
```

結果は以下のようになります：

```html
<p>foo@domain.com</p>
<p>hello {world}</p>
<p>option A | option B</p>
```

:::tip NOTE
特殊文字以外の文字の前にあるバックスラッシュは、リテラルのバックスラッシュとして扱われます。例えば、メッセージ内の `\n` は改行ではなく `\n`（バックスラッシュ + n）のまま残ります。
:::

## Rails i18n フォーマット

Vue I18n は、[Ruby on Rails i18n](https://guides.rubyonrails.org/i18n.html) と互換性のあるメッセージフォーマットをサポートしています。

`%` プレフィックスを使用してメッセージフォーマット構文を補間できます：

:::danger 重要
v10 以降では、Rails i18n フォーマットは非推奨になります。名前付き補間の使用を推奨します。
:::

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    message: {
      hello: '%{msg} world'
    }
  }
}
```

これは、`{ message: { hello: '%{msg} world' } }` で `en` ロケールを定義しています。

[名前付き補間](#名前付き補間) と同様に、JavaScript で定義された変数を指定できます。上記のロケールメッセージでは、JavaScript で定義された `msg` を翻訳関数のパラメータとして与えることでローカライズできます。

以下は、テンプレートでの `$t` の使用例です：

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

結果は以下のようになります：

```html
<p>hello world</p>
```

## HTML メッセージ

HTML を含むメッセージでローカライズできます。

:::danger 危険
:warning: サイト上で任意の HTML を動的にローカライズすることは、XSS の脆弱性につながりやすいため非常に危険です。HTML 補間は信頼できるコンテンツでのみ使用し、ユーザー提供のコンテンツでは絶対に使用しないでください。

[コンポーネント補間](../advanced/component) の使用を推奨します。
:::

:::warning 注意
メッセージに HTML が含まれている場合、Vue I18n は開発モード (`process.env`<wbr/>`.NODE_ENV !== 'production'`) のときにコンソールに警告を出力します。

`createI18n` または `useI18n` の `warnHtmlInMessage` または `warnHtmlMessage` オプションで警告出力を制御できます。
:::

例として、以下のロケールメッセージリソース：

```js
const messages = {
  en: {
    message: {
      hello: 'hello <br> world'
    }
  }
}
```

これは、`{ message: { hello: 'hello <br> world' } }` で `en` ロケールを定義しています。

以下は、テンプレートでの `v-html` と `$t` の使用例です：

```html
<p v-html="$t('message.hello')"></p>
```

結果は以下のようになります：

```html
<p>hello
<!--<br> exists but is rendered as html and not a string-->
world</p>
```