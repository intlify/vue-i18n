# General


## createI18n

Vue I18n factory

**Signature:**
```typescript
export declare function createI18n<Options extends I18nOptions = {}, Messages extends Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>> = Record<keyof Options['messages'], LocaleMessageDictionary<VueMessageType>>, DateTimeFormats extends Record<keyof Options['datetimeFormats'], DateTimeFormat> = Record<keyof Options['datetimeFormats'], DateTimeFormat>, NumberFormats extends Record<keyof Options['numberFormats'], NumberFormat> = Record<keyof Options['numberFormats'], NumberFormat>>(options?: Options): I18n<Options['messages'], Options['datetimeFormats'], Options['numberFormats'], Options['legacy'] extends boolean ? Options['legacy'] : true>;
```

**Details**

If you use Legacy API mode, you need to specify [VueI18nOptions](legacy#vuei18noptions) and `legacy: true` option.

If you use composition API mode, you need to specify [ComposerOptions](composition#composeroptions).

**See Also**
-  [Getting Started](../guide/)  
-  [Composition API](../guide/advanced/composition)

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| options | Options | An options, see the [I18nOptions](general#i18noptions) |

### Returns

 [I18n](general#i18n) instance

**Examples**

**Example 1:**

case: for Legacy API
```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

// call with I18n option
const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: { ... },
    ja: { ... }
  }
})

const App = {
  // ...
}

const app = createApp(App)

// install!
app.use(i18n)
app.mount('#app')
```



**Example 2:**

case: for composition API
```js
import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

// call with I18n option
const i18n = createI18n({
  legacy: false, // you must specify 'legacy: false' option
  locale: 'ja',
  messages: {
    en: { ... },
    ja: { ... }
  }
})

const App = {
  setup() {
    // ...
    const { t } = useI18n({ ... })
    return { ... , t }
  }
}

const app = createApp(App)

// install!
app.use(i18n)
app.mount('#app')
```




## ExportedGlobalComposer

Exported global composer instance

**Signature:**
```typescript
export interface ExportedGlobalComposer 
```

**Details**

This interface is the [global composer](general#global) that is provided interface that is injected into each component with `app.config.globalProperties`.

### availableLocales

Available locales

**Signature:**
```typescript
readonly availableLocales: Locale[];
```

**Details**

This property is proxy-like property for `Composer#availableLocales`. About details, see the [Composer#availableLocales](composition#availablelocales)

### fallbackLocale

Fallback locale

**Signature:**
```typescript
fallbackLocale: FallbackLocale;
```

**Details**

This property is proxy-like property for `Composer#fallbackLocale`. About details, see the [Composer#fallbackLocale](composition#fallbacklocale)

### locale

Locale

**Signature:**
```typescript
locale: Locale;
```

**Details**

This property is proxy-like property for `Composer#locale`. About details, see the [Composer#locale](composition#locale)

## I18n

I18n instance

**Signature:**
```typescript
export interface I18n<Messages = {}, DateTimeFormats = {}, NumberFormats = {}, Legacy extends boolean = true> 
```

**Details**

The instance required for installation as the Vue plugin

### global

The property accessible to the global Composer instance or VueI18n instance

**Signature:**
```typescript
readonly global: Legacy extends true ? VueI18n<Messages, DateTimeFormats, NumberFormats> : Composer<Messages, DateTimeFormats, NumberFormats>;
```

**Details**

If the [I18n#mode](general#mode) is `'legacy'`, then you can access to a global [VueI18n](legacy#vuei18n) instance, else then [I18n#mode](general#mode) is `'composition' `, you can access to the global [Composer](composition#composer) instance.

An instance of this property is **global scope***.

### mode

Vue I18n API mode

**Signature:**
```typescript
readonly mode: I18nMode;
```

**Details**

If you specified `legacy: true` option in `createI18n`, return `legacy`, else `composition`

**Default Value**

`'composition'`

### install(app, options)

Install entry point

**Signature:**
```typescript
install(app: App, ...options: unknown[]): void;
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| app | App | A target Vue app instance |
| options | unknown[] | An install options |

## I18nAdditionalOptions

I18n Additional Options

**Signature:**
```typescript
export interface I18nAdditionalOptions 
```

**Details**

Specific options for [createI18n](general#createi18n)

### globalInjection

Whether Whether to inject global properties & functions into for each component.

**Signature:**
```typescript
globalInjection?: boolean;
```

**Details**

If set to `true`, then properties and methods prefixed with `$` are injected into Vue Component.

**Default Value**

`false`

**See Also**
-  [Implicit with injected properties and functions](../guide/advanced/composition#implicit-with-injected-properties-and-functions)  
-  [ComponentCustomProperties](injection#componentcustomproperties)

### legacy

Whether vue-i18n Legacy API mode use on your Vue App

**Signature:**
```typescript
legacy?: boolean;
```

**Details**

The default is to use the Legacy API mode. If you want to use the Composition API mode, you need to set it to `false`.

**Default Value**

`true`

**See Also**
-  [Composition API](../guide/advanced/composition)

## I18nMode

Vue I18n API mode

**Signature:**
```typescript
export declare type I18nMode = 'legacy' | 'composition';
```

**See Also**
-  [I18n#mode](general#mode)

## I18nOptions

I18n Options for `createI18n`

**Signature:**
```typescript
export declare type I18nOptions = I18nAdditionalOptions & (ComposerOptions | VueI18nOptions);
```

**Details**

`I18nOptions` is inherited [I18nAdditionalOptions](general#i18nadditionaloptions), [ComposerOptions](composition#composeroptions) and [VueI18nOptions](legacy#vuei18noptions), so you can specify these options.

## I18nPluginOptions

Vue I18n plugin options

**Signature:**
```typescript
export interface I18nPluginOptions 
```

**Details**

An options specified when installing Vue I18n as Vue plugin with using `app.use`.

### globalInstall

Whether to globally install the components that is offered by Vue I18n

**Signature:**
```typescript
globalInstall?: boolean;
```

**Details**

If this option is enabled, the components will be installed globally at `app.use` time.

If you want to install manually in the `import` syntax, you can set it to `false` to install when needed.

**Default Value**

`true`

### useI18nComponentName

Whether to use the tag name `i18n` for Translation Component

**Signature:**
```typescript
useI18nComponentName?: boolean;
```

**Details**

This option is used for compatibility with Vue I18n v8.x.

If you can't migrate right away, you can temporarily enable this option, and you can work Translation Component.

**Default Value**

`false`

## I18nScope

I18n Scope

**Signature:**
```typescript
export declare type I18nScope = 'local' | 'parent' | 'global';
```

**See Also**
-  [ComposerAdditionalOptions#useScope](composition#usescope)  
-  [useI18n](composition#usei18n)

## VERSION

Vue I18n Version

**Signature:**
```typescript
VERSION: string
```

**Details**

Semver format. Same format as the package.json `version` field.

