# Components


## BaseFormatProps

BaseFormat Props for Components that is offered Vue I18n

**Signature:**
```typescript
export interface BaseFormatProps 
```

**Details**

The interface definitions of the underlying props of components such as Translation, DatetimeFormat, and NumberFormat.

### locale

**Signature:**
```typescript
locale?: Locale;
```

**Details**

Specifies the locale to be used for the component.

If specified, the global scope or the locale of the parent scope of the target component will not be overridden and the specified locale will be used.

### scope

**Signature:**
```typescript
scope?: ComponentI18nScope;
```

**Details**

Specifies the scope to be used in the target component.

You can specify either `global` or `parent`.

If `global` is specified, global scope is used, else then `parent` is specified, the scope of the parent of the target component is used.

If the parent is a global scope, the global scope is used, if it's a local scope, the local scope is used.

### tag

**Signature:**
```typescript
tag?: string | object;
```

**Details**

Used to wrap the content that is distribute in the slot. If omitted, the slot content is treated as Fragments.

You can specify a string-based tag name, such as `p`, or the object for which the component is defined.

## DatetimeFormat

Datetime Format Component

**Signature:**
```typescript
DatetimeFormat: {
    name: string;
    props: {
        value: {
            type: (NumberConstructor | DateConstructor)[];
            required: boolean;
        };
        format: {
            type: (ObjectConstructor | StringConstructor)[];
        };
    } & {
        tag: {
            type: (ObjectConstructor | StringConstructor)[];
        };
        locale: {
            type: StringConstructor;
        };
        scope: {
            type: StringConstructor;
            validator: (val: "parent" | "global") => boolean;
            default: "parent" | "global";
        };
    };
    setup(props: DatetimeFormatProps, context: SetupContext): RenderFunction;
}
```

**Details**

See the following items for property about details

:::danger
 Not supported IE, due to no support `Intl.DateTimeFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)

If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
:::

**See Also**
-  [FormattableProps](component#formattableprops)  
-  [BaseFormatProps](component#baseformatprops)  
-  [Custom Formatting](../guide/essentials/datetime#custom-formatting)

## DatetimeFormatProps

DatetimeFormat Component Props

**Signature:**
```typescript
export declare type DatetimeFormatProps = FormattableProps<number | Date, Intl.DateTimeFormatOptions>;
```

## FormattableProps

Formattable Props

**Signature:**
```typescript
export interface FormattableProps<Value, Format> extends BaseFormatProps 
```

**Details**

The props used in DatetimeFormat, or NumberFormat component

### format

**Signature:**
```typescript
format?: string | Format;
```

**Details**

The format to use in the target component.

Specify the format key string or the format as defined by the Intl API in ECMA 402.

### value

**Signature:**
```typescript
value: Value;
```

**Details**

The value specified for the target component

## NumberFormat

Number Format Component

**Signature:**
```typescript
NumberFormat: {
    name: string;
    props: {
        value: {
            type: NumberConstructor;
            required: boolean;
        };
        format: {
            type: (ObjectConstructor | StringConstructor)[];
        };
    } & {
        tag: {
            type: (ObjectConstructor | StringConstructor)[];
        };
        locale: {
            type: StringConstructor;
        };
        scope: {
            type: StringConstructor;
            validator: (val: "parent" | "global") => boolean;
            default: "parent" | "global";
        };
    };
    setup(props: NumberFormatProps, context: SetupContext): RenderFunction;
}
```

**Details**

See the following items for property about details

:::danger
 Not supported IE, due to no support `Intl.NumberFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)

If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)
:::

**See Also**
-  [FormattableProps](component#formattableprops)  
-  [BaseFormatProps](component#baseformatprops)  
-  [Custom Formatting](../guide/essentials/number#custom-formatting)

## NumberFormatProps

NumberFormat Component Props

**Signature:**
```typescript
export declare type NumberFormatProps = FormattableProps<number, Intl.NumberFormatOptions>;
```

## Translation

Translation Component

**Signature:**
```typescript
Translation: {
    name: string;
    props: {
        keypath: {
            type: StringConstructor;
            required: boolean;
        };
        plural: {
            type: (StringConstructor | NumberConstructor)[];
            validator: (val: any) => boolean;
        };
    } & {
        tag: {
            type: (ObjectConstructor | StringConstructor)[];
        };
        locale: {
            type: StringConstructor;
        };
        scope: {
            type: StringConstructor;
            validator: (val: "parent" | "global") => boolean;
            default: "parent" | "global";
        };
    };
    setup(props: TranslationProps, context: SetupContext): RenderFunction;
}
```

**Details**

See the following items for property about details

**See Also**
-  [TranslationProps](component#translationprops)  
-  [BaseFormatProps](component#baseformatprops)  
-  [Component Interpolation](../guide/advanced/component)

**Examples**


```html
<div id="app">
  <!-- ... -->
  <i18n path="term" tag="label" for="tos">
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

Translation Component Props

**Signature:**
```typescript
export interface TranslationProps extends BaseFormatProps 
```

### keypath

**Signature:**
```typescript
keypath: string;
```

**Details**

The locale message key can be specified prop

### plural

**Signature:**
```typescript
plural?: number | string;
```

**Details**

The Plural Choosing the message number prop

