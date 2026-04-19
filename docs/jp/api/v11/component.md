# コンポーネント

## BaseFormatProps

Vue I18n が提供するコンポーネントの基本フォーマット Props

**シグネチャ:**
```typescript
export interface BaseFormatProps
```

**詳細**

Translation、DatetimeFormat、NumberFormat などのコンポーネントの基盤となる props のインターフェース定義。

### i18n

**シグネチャ:**
```typescript
i18n?: Composer;
```

**詳細**

既存のスコープを持つ composer インスタンス。

このオプションは `scope` オプションよりも優先されます。

### locale

**シグネチャ:**
```typescript
locale?: Locale;
```

**詳細**

コンポーネントに使用するロケールを指定します。

指定した場合、グローバルスコープやターゲットコンポーネントの親スコープのロケールは上書きされず、指定されたロケールが使用されます。

### scope

**シグネチャ:**
```typescript
scope?: ComponentI18nScope;
```

**詳細**

ターゲットコンポーネントで使用するスコープを指定します。

`global` または `parent` を指定できます。

`global` が指定された場合はグローバルスコープが使用され、`parent` が指定された場合はターゲットコンポーネントの親スコープが使用されます。

親がグローバルスコープの場合はグローバルスコープが使用され、ローカルスコープの場合はローカルスコープが使用されます。

### tag

**シグネチャ:**
```typescript
tag?: string | object;
```

**詳細**

スロットに配信されるコンテンツをラップするために使用されます。省略した場合、スロットコンテンツはフラグメントとして扱われます。

`p` などの文字列ベースのタグ名、またはコンポーネントが定義されているオブジェクトを指定できます。

## DatetimeFormat

日時フォーマットコンポーネント

**シグネチャ:**
```typescript
DatetimeFormat: {
    new (): {
        $props: VNodeProps & DatetimeFormatProps & BaseFormatProps;
    };
}
```

**詳細**

詳細については、以下の項目を参照してください

:::danger
IE はサポートされていません。[IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts) で `Intl.DateTimeFormat#formatToParts` がサポートされていないためです。

使用したい場合は、[polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat) を使用する必要があります。
:::

**参照**
- [FormattableProps](component#formattableprops)
- [BaseFormatProps](component#baseformatprops)
- [カスタムフォーマット](../../guide/essentials/datetime#custom-formatting)

## DatetimeFormatProps

DatetimeFormat コンポーネント Props

**シグネチャ:**
```typescript
export type DatetimeFormatProps = FormattableProps<number | Date, Intl.DateTimeFormatOptions>;
```

## FormattableProps

フォーマット可能 Props

**シグネチャ:**
```typescript
export interface FormattableProps<Value, Format> extends BaseFormatProps
```

**詳細**

DatetimeFormat または NumberFormat コンポーネントで使用される props

### format

**シグネチャ:**
```typescript
format?: string | Format;
```

**詳細**

ターゲットコンポーネントで使用するフォーマット。

フォーマットキー文字列、または ECMA 402 の Intl API で定義されたフォーマットを指定します。

### value

**シグネチャ:**
```typescript
value: Value;
```

**詳細**

ターゲットコンポーネントに指定された値

## NumberFormat

数値フォーマットコンポーネント

**シグネチャ:**
```typescript
NumberFormat: {
    new (): {
        $props: VNodeProps & NumberFormatProps & BaseFormatProps;
    };
}
```

**詳細**

詳細については、以下の項目を参照してください

:::danger
IE はサポートされていません。[IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts) で `Intl.NumberFormat#formatToParts` がサポートされていないためです。

使用したい場合は、[polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat) を使用する必要があります。
:::

**参照**
- [FormattableProps](component#formattableprops)
- [BaseFormatProps](component#baseformatprops)
- [カスタムフォーマット](../../guide/essentials/number#custom-formatting)

## NumberFormatProps

NumberFormat コンポーネント Props

**シグネチャ:**
```typescript
export type NumberFormatProps = FormattableProps<number, Intl.NumberFormatOptions>;
```

## Translation

翻訳コンポーネント

**シグネチャ:**
```typescript
Translation: {
    new (): {
        $props: VNodeProps & TranslationProps;
    };
}
```

**詳細**

詳細については、以下の項目を参照してください

**参照**
- [TranslationProps](component#translationprops)
- [BaseFormatProps](component#baseformatprops)
- [コンポーネント補間](../../guide/advanced/component)

**例**


```html
<div id="app">
  <!-- ... -->
  <i18n keypath="term" tag="label" for="tos">
    <a :href="url" target="_blank">{{ $t('tos') }}</a>
  </i18n>
  <!-- ... -->
</div>
```


```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    tos: 'Term of Service',
    term: 'I accept xxx {0}.'
  },
  ja: {
    tos: '利用規約',
    term: '私は xxx の{0}に同意します。'
  }
}

const i18n = createI18n({
  locale: 'en',
  messages
})

const app = createApp({
  data: {
    url: '/term'
  }
}).use(i18n).mount('#app')
```




## TranslationProps

Translation コンポーネント Props

**シグネチャ:**
```typescript
export interface TranslationProps extends BaseFormatProps
```

### keypath

**シグネチャ:**
```typescript
keypath: string;
```

**詳細**

ロケールメッセージキーを指定できる prop

### plural

**シグネチャ:**
```typescript
plural?: number | string;
```

**詳細**

メッセージ数の複数形を選択する prop
