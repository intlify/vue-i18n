# 指令

## TranslationDirective

翻译指令 (`v-t`)

**签名：**
```typescript
export type TranslationDirective<T = HTMLElement> = ObjectDirective<T>;
```

:::danger 已废弃
将在 vue-i18n v12 中移除
:::

**详情**

更新使用语言环境消息本地化的元素 `textContent`。

您可以使用字符串语法或对象语法。

字符串语法可以指定为语言环境消息的键路径。

如果使用对象语法，则需要指定以下参数作为对象键
```
- path: 必填，语言环境消息的键
- locale: 可选，语言环境
- args: 可选，用于列表或命名格式化
```



**示例**


```html
<!-- 字符串语法：字面量 -->
<p v-t="'foo.bar'"></p>

<!-- 字符串语法：通过 data 或 computed props 绑定 -->
<p v-t="msg"></p>

<!-- 对象语法：字面量 -->
<p v-t="{ path: 'hi', locale: 'ja', args: { name: 'kazupon' } }"></p>

<!-- 对象语法：通过 data 或 computed props 绑定 -->
<p v-t="{ path: greeting, args: { name: fullName } }"></p>
```
