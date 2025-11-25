# Directives

## TranslationDirective

Translation Directive (`v-t`)

**Signature:**
```typescript
export type TranslationDirective<T = HTMLElement> = ObjectDirective<T>;
```

:::danger DEPRECATED
will be removed at vue-i18n v12
:::

**Details**

Update the element `textContent` that localized with locale messages.

You can use string syntax or object syntax.

String syntax can be specified as a keypath of locale messages.

If you can be used object syntax, you need to specify as the object key the following params
```
- path: required, key of locale messages
- locale: optional, locale
- args: optional, for list or named formatting
```



**Examples**


```html
<!-- string syntax: literal -->
<p v-t="'foo.bar'"></p>

<!-- string syntax: binding via data or computed props -->
<p v-t="msg"></p>

<!-- object syntax: literal -->
<p v-t="{ path: 'hi', locale: 'ja', args: { name: 'kazupon' } }"></p>

<!-- object syntax: binding via data or computed props -->
<p v-t="{ path: greeting, args: { name: fullName } }"></p>
```




