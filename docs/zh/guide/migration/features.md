# v9 新特性

Vue I18n v9 不仅提供了 Vue 3 支持，还包含了新特性。

## 消息格式语法

- 参见 [字面量插值](../essentials/syntax#literal-interpolation)

## 消息函数

- 参见 [链接消息](../advanced/function#linked-messages)
- 参见 [复数化](../advanced/function#pluralization)

## 组合式 API

参见 [组合式 API](../advanced/composition) 高级部分

## 翻译组件

支持 `plural` prop。
你可以指定要复数化的消息数量。

以下示例：

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

## DatetimeFormat 组件

对于日期时间本地化，从 Vue I18n v9 开始，我们也提供了像 [NumberFormat 组件](../essentials/number#custom-formatting) 一样的 DatetimeFormat 组件。

参见 [日期时间本地化自定义格式](../essentials/datetime#custom-formatting)

## i18n 自定义块

- 参见 [`global` 属性](../advanced/sfc#define-locale-messages-for-global-scope)
