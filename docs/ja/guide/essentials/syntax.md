# メッセージフォーマット構文

Vue I18nでは、メッセージフォーマット構文を使って、UIに表示するメッセージをローカライズすることができます。Vue I18nのmessagesは、様々な機能の構文を持つ補間やメッセージです。

## 補間

Vue I18nは、プレースホルダー`{}`を使った補間をサポートしています。

### 名前付き補間

名前付き補間は、JavaScriptで定義された変数名を使ってプレースホルダーを補間することができます。

以下は名前付き補完を使ったロケールメッセージの例です：

```js
const messages = {
  en: {
    message: {
      hello: '{msg} world'
    }
  }
}
```

上記のロケールメッセージは、`createI18n`の`messages`オプションで指定されたリソースです。`en`ロケールで`{ message: { hello: '{msg} world' } }`と定義されています。

名前付き補間では、JavaScriptで定義された変数を指定することができます。上記のロケールメッセージでは、JavaScriptで定義されたmsgを翻訳関数のパラメータとして与えることで、ローカライズすることができます。

以下は、テンプレートでの`$t`の使用例です。

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

`$t`のパラメータとして、第1引数にロケールメッセージのキーとして`message.hello`を、第2引数に`msg`プロパティを持つオブジェクトを指定します。

:::tip 備考
翻訳関数のロケールメッセージリソースキーは、特定のリソース名前空間に対して、JavaScriptのオブジェクトと同様に、`.`（ドット）を使って指定することができます。
::::

:::tip 備考
`$t`にはいくつかのオーバーロードがあります。この点については、[API リファレンス](../../api/injection#t-key)を参照してください。
:::

出力は以下のようになります：

```html
<p>hello world</p>
```

### リスト補間

リスト補完では、JavaScriptで定義された配列を使ってプレースホルダーを補間できます。

以下はリスト補完を使ったロケールメッセージの例です：

```js
const messages = {
  en: {
    message: {
      hello: '{0} world'
    }
  }
}
```

`en`ロケールで`{ message: { hello: '{0} world' } }`と定義されています。

リスト補間ではJavaScriptで定義された配列を指定できます。上記のロケールメッセージでは翻訳関数のパラメータとして、配列のインデックス`0`の項目を渡すことでローカライズされます。

以下は、テンプレートでの`$t`の使用例です。

```html
<p>{{ $t('message.hello', ['hello']) }}</p>
```

`$t`のパラメータとして、第1引数にロケールメッセージのキーとして`message.hello`を、第2引数に`'hello'`項目を持つ配列を指定します。

出力は以下のようになります。

```html
<p>hello world</p>
```

### リテラル補間

リテラル補間では文字列リテラルを使ってプレースホルダーを補間できます。

以下はリテラル補完を使ったロケールメッセージの例です：

```js
const messages = {
  en: {
    address: "{account}{'@'}{domain}"
  }
}
```

`en`ロケールで`{ address: "{account}{'@'}{domain} }`と定義されています。

リテラル補間では、文字列リテラルをシングルクォーテーション`'`で囲んで指定することができます。リテラル補間で指定されたメッセージは、翻訳関数により、**文字列**としてローカライズされます。

以下は、テンプレートでの`$t`の使用例です。

```html
<p>email: {{ $t('address', { account: 'foo', domain: 'domain.com' }) }}</p>
```

`$t`のパラメータとして、第1引数にロケールメッセージのキーとして`address`を、第2引数として`account`と`domain`プロパティを持つオブジェクトを指定します。

出力は以下のようになります：

```html
<p>email: foo@domain.com</p>
```

:::tip 備考
リテラル補間は`{`や`}`のような特殊文字をメッセージフォーマット構文内で使う際に便利です。
:::

## リンクメッセージ

他のロケールメッセージキーと常に同じ具体的なテキストを持つロケールメッセージキーがあれば、それにリンクすることができます。

*`@:`* の後にリンクしたいロケールメッセージキーを名前空間を含めて *`@:key`* のように指定することで、他のロケールメッセージキーにリンクできます。

以下はその例です：

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

`en`ロケールは階層構造のオブジェクトを持ちます。

`message`は、`message.the_world`と`message.dio`を持ちます。`message.linked`は、`@:message.dio @:message.the_world !!!!`を持ち、`message.dio`と`message.the_world`でロケールのメッセージキーにリンクしています。

以下は、テンプレートでの`$t`の使用例です。

```html
<p>{{ $t('message.linked') }}</p>
```

`$t`のパラメータとして、第1引数に`message.linked`をロケールメッセージキーとして渡します。

出力は以下のようになります：

```html
<p>DIO: the world !!!!</p>
```

### ビルトインの修飾子

文字に大文字・小文字がある言語の場合、リンクされたロケールメッセージの大文字・小文字を操作したい場合があります。リンクされたメッセージは、`@.修飾子:key`の形式でフォーマットすることができます。

現在、以下の修飾子が使用可能です。

* `upper`：リンク先のメッセージのすべての文字を大文字にする
* `lower`：リンク先のメッセージのすべての文字を小文字にする
* `capitalize`: リンク先のメッセージの最初の文字を大文字にする

以下はその例です：

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

`en`ロケールは階層構造のオブジェクトを持ちます。

`message.homeAddress`は`Home address`を持ちます。`message.missingHomeAddress`は、`Please provide @.lower:message.homeAddress`を持ち、ロケールメッセージキー`message.homeAddress`にリンクしています。

上記の例では修飾子`.lower`が指定されているので、リンクされている`message.homeAddress`キーが解決された後、それが評価されます。

以下は、テンプレート内での`$t`の使用例です：

```html
<label>{{ $t('message.homeAddress') }}</label>
<p class="error">{{ $t('message.missingHomeAddress') }}</p>
```

出力は以下のようになります：

```html
<label>Home address</label>
<p class="error">Please provide home address</p>
```

### カスタム修飾子

ビルトインでない修飾子を使いたい場合、カスタム修飾子が使えます。

カスタム修飾子を使う場合、`createI18n`の`modifiers`オプションを指定する必要があります：

```js
const i18n = createI18n({
  locale: 'en',
  messages: {
    // ロケールメッセージを設定
  },
  // `modifiers`オプションにカスタム修飾子を設定
  modifiers: {
    snakeCase: (str) => str.split(' ').join('_')
  }
})
```

ロケールメッセージ：

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

`en`ロケールは階層構造のオブジェクトを持ちます。

`message.snake`は`snake case`を持ちます。`message.custom_modifier`は`custom modifiers example: @.snakeCase:{'message.snake'}`を持ち、ロケールメッセージキーにリンクされており、リテラルで補間されています。

:::tip 備考
リンクメッセージのキーには補間（名前付き、リスト、リテラル）が使えます。
:::


## 特殊文字

メッセージフォーマット構文で使用される以下の文字はコンパイラによって特殊文字として処理されます。

- `{`
- `}`
- `@`
- `$`
- `|`

これらの文字を使いたい場合、[リテラル補間](#リテラル補間)が必要です。

## Rails i18n フォーマット

Vue I18nは、[Ruby on Rails i18n](https://guides.rubyonrails.org/i18n.html)と互換性のあるメッセージフォーマットをサポートしています。

メッセージフォーマットは、`%`の接頭辞で補間することができます。

:::danger 重要
v10以降では、Railsのi18nフォーマットは非推奨となります。名前付き補間を使うことを推奨しています。
:::

ロケールメッセージの例：

```js
const messages = {
  en: {
    message: {
      hello: '%{msg} world'
    }
  }
}
```

`en`ロケールで`{ message: { hello: '%{msg} world' } }`と定義されています。

[名前付き補間](#名前付き補間)と同様に、JavaScriptで定義された変数を指定することができます。上のロケールメッセージでは、JavaScriptで定義された`msg`を翻訳関数のパラメータとして与えることで、ローカライズすることができます。

以下は、テンプレートでの`$t`の使用例です。

```html
<p>{{ $t('message.hello', { msg: 'hello' }) }}</p>
```

出力は以下のようになります：

```html
<p>hello world</p>
```

## HTML メッセージ

HTMLを含むメッセージをローカライズできます。

:::danger 危険
:warning: サイト上の任意のHTMLを動的にローカライズすることは、XSS脆弱性につながりやすく非常に危険です。HTML補間は信頼できるコンテンツにのみ使用し、ユーザーが提供するコンテンツには決して使用しないでください。

私たちは、[コンポーネント補間](../advanced/component)の使用を推奨します。
:::

:::warning 注意
開発モード(`process.env.NODE_ENV !== 'production'`)の場合、メッセージにHTMLが含まれていると、Vue I18nはコンソールに警告を出力します。

警告の出力は、`createI18n`または`useI18n`の`warnHtmlInMessage`または`warnHtmlMessage`オプションで制御できます。
:::

ロケールメッセージの例：

```js
const messages = {
  en: {
    message: {
      hello: 'hello <br> world'
    }
  }
}
```

`en`ロケールで`{ message: { hello: 'hello <br> world' } }`と定義されています。

以下は、テンプレートでの`v-html`と`$t`の使用例です：

```html
<p v-html="$t('message.hello')"></p>
```

出力は以下のようになります：

```html
<p>hello
<!--<br>は存在しますが、文字列でなくhtmlとして描画されます-->
world</p>
```
