# v9 新機能

Vue I18n v9はVue 3のサポートを提供するだけでなく、新しい機能も含まれています。

## メッセージフォーマット構文

- [リテラル補間](../essentials/syntax#literal-interpolation)を参照してください

## メッセージ関数

- [リンクメッセージ](../advanced/function#linked-messages)を参照してください
- [複数形](../advanced/function#pluralization)を参照してください

## Composition API

[Composition API](../advanced/composition)の高度なセクションを参照してください

## 翻訳コンポーネント

`plural` propのサポート。
複数形にするメッセージの数を指定できます。

以下の例：

<!-- eslint-skip -->

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  locale: 'en',
  messages: {
    en: {
      message: {
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    }
  }
})

const count = ref(0)
</script>

<template>
  <i18n-t keypath="message.plural" :plural="count">
    <template #n>
      <b>{{ count }}</b>
    </template>
  </i18n-t>
</template>
```

## DatetimeFormat コンポーネント

日時ローカライズのために、Vue I18n v9以降、[NumberFormat コンポーネント](../essentials/number#custom-formatting)のようなDatetimeFormatコンポーネントも提供しています。

[日時ローカライズのカスタムフォーマット](../essentials/datetime#custom-formatting)を参照してください

## i18n カスタムブロック

- [`global` 属性](../advanced/sfc#define-locale-messages-for-global-scope)を参照してください
