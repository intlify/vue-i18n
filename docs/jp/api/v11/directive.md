# ディレクティブ

## TranslationDirective

翻訳ディレクティブ (`v-t`)

**シグネチャ:**
```typescript
export type TranslationDirective<T = HTMLElement> = ObjectDirective<T>;
```

:::danger 非推奨
vue-i18n v12 で削除されます
:::

**詳細**

ロケールメッセージでローカライズされた要素の `textContent` を更新します。

文字列構文またはオブジェクト構文を使用できます。

文字列構文は、ロケールメッセージのキーパスとして指定できます。

オブジェクト構文を使用する場合は、オブジェクトキーとして以下のパラメータを指定する必要があります
```
- path: 必須、ロケールメッセージのキー
- locale: オプション、ロケール
- args: オプション、リストまたは名前付きフォーマット用
```



**例**


```html
<!-- 文字列構文: リテラル -->
<p v-t="'foo.bar'"></p>

<!-- 文字列構文: data または computed props によるバインディング -->
<p v-t="msg"></p>

<!-- オブジェクト構文: リテラル -->
<p v-t="{ path: 'hi', locale: 'ja', args: { name: 'kazupon' } }"></p>

<!-- オブジェクト構文: data または computed props によるバインディング -->
<p v-t="{ path: greeting, args: { name: fullName } }"></p>
```
