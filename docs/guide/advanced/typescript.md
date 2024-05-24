# TypeScript Support

:::tip Supported Versions
:new: 9.2+
:::

VueI18n use the resources, which locale messages, datetime formats and number formats.
Especially, locale messages can be externalized as i18n resources, such as `json` files, in order to collaborate with translators using the Localization service, and these resources can be imported for collaboration.

In order to achieve a smooth localization workflow in conjunction with the Localization Service, you may want to prevent missing localizations or missing resource definitions for externalized i18n resources.
And in development, you may not want to spoil the developer experience by preventing key string mistakes in using the translation function like `$t`.

## Type-safe resources with schema

You can support the type-safe resources with resource schema using TypeScript.

### Type-safe resources in `createI18n`

The following is an example code to define type-safe resources for `messages` defined with `createI18n` option.

Locale messages resource:

```json
{
  "world": "the world!"
}
```

Application entrypoint:

```ts
import { createI18n } from 'vue-i18n'
import enUS from './locales/en-US.json'

// Type-define 'en-US' as the master schema for the resource
type MessageSchema = typeof enUS

const i18n = createI18n<[MessageSchema], 'en-US' | 'ja-JP'>({
  locale: 'en-US',
  messages: {
    'en-US': enUS
  }
})
```

The above code defines a type from the `en-US` message resource specified in the `messages` option of `createI18n`. This defined type is the master-like schema for message resources handled with VueI18n. This means that you can define it **as a single source of truth** resource in your application. You can define a type-safe resource in other locales by specifying the type defined as a schema from a message resource as the first argument of the type parameter of `createI18n`.

The second argument of the type parameter of `createI18n` is the locale to handle. With this, type checking is performed for each locale specified in the second argument, based on the type of the resource specified in the first argument. In the above code example, `en-US` and `ja-JP` are specified as the main locale, which is also specified in the `locale` option. If you compile typescript in this state, you will get the following error to check that no `ja-JP` resource is defined in the `messages` option.

```sh
$ npx tsc
npx tsc
src/main.ts:11:3 - error TS2741: Property '"ja-JP"' is missing in type '{ 'en-US': { world: string; }; }' but required in type '{ "en-US": { world: string; }; "ja-JP": { world: string; }; }'.

11   messages: {
     ~~~~~~~~

  node_modules/vue-i18n/dist/vue-i18n.d.ts:712:5
    712     messages?: {
            ~~~~~~~~
    The expected type comes from property 'messages' which is declared here on type 'I18nOptions<{ message: { world: string; }; datetime: DateTimeFormat; number: NumberFormat; }, { messages: "en-US"; datetimeFormats: "en-US"; numberFormats: "en-US"; } | { ...; }, ComposerOptions<...> | VueI18nOptions<...>>'


Found 1 error.
```

If you are using [Visual Studio Code](https://code.visualstudio.com/) as an editor, you can notice that there is a resource definition omission in the editor with the following error before you run the typescript compilation.

![VSCode-Type-Error1](/ts-support-1.png)
![VSCode-Type-Error2](/ts-support-2.png)

### Type-safe resources in `useI18n`

Type-safe resources can be defined not only with `createI18n`, but also on a per-component basis with `useI18n` used with the Composition API.

In addition to local messages, the resource type definitions can also include datetime formats and number formats.

The following is an example of code that defines type-safe resources for locale messages and number formats on a per-component basis in `useI18n`.

locale messages to import in Vue components:

```json
{
  "messages": {
    "hello": "Hello, {name}!"
  }
}
```

Vue components with type-safe resources:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import enUS from './en-US.json' // import locale messages for Vue component

// define message schema for Vue component
type MessageSchema = typeof enUS

// define number format schema for Vue component
type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}

/*
 * You can specify the your definition schema with object literal at first type parameters
 * About type parameter, see the http://vue-i18n.intlify.dev/api/composition.html#usei18n
 */
const { t, n } = useI18n<{
  message: MessageSchema,
  number: NumberSchema
}, 'en-US'>({
  inheritLocale: true,
  messages: {
    'en-US': enUS
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'USD'
      }
    }
  }
})
</script>

<template>
  <p>message: {{ t('messages.hello', { name: 'kazupon' }) }}</p>
  <p>currency: {{ n(1000, 'currency') }}</p>
</template>
```

the above codes, by specifying the defined schema as the first type parameter of `useI18n`, you can use TypeScript to check for undefined resources for locale messages and number formats. Also, by specifying the locale to be defined in the second type parameter, TypeScript can check for undefined locales.

:::warning Limitation
- Type safety is not supported for i18n custom blocks in SFC. We'll plan to support it in the future.
- Currently support for `JSON` format only.
:::

The code described so far is available as [example](https://github.com/intlify/vue-i18n/tree/master/examples/type-safe). Let's check it!

### Type-Safe supporting APIs

Other APIs support a type parameter that allows you to specify the schema of a resource for type-safe resource manipulation, such as:

- `getLocaleMessage`
- `setLocaleMessage`
- `mergeLocaleMessage`
- `getDateTimeFormat`
- `setDateTimeFormat`
- `mergeDateTimeFormat`
- `getNumberFormat`
- `setNumberFormat`
- `mergeNumberFormat`

For more details, check out these following API documentation pages.

- [Legacy API](https://vue-i18n.intlify.dev/api/legacy)
- [Composition API](https://vue-i18n.intlify.dev/api/composition)

## Resource Keys completion supporting

:::warning NOTICE
Resource Keys completion can be used if you are using [Visual Studio Code](https://code.visualstudio.com/)
:::

Along with the support for type-safe resource definitions, VueI18n now provides APIs such as `t` and `d` for interpolating resource keys in the Composition API.

The following indicate how to interpolate Resource keys in Visual Studio Code for the local scope Vue component described above.

![VSCode-Resource-Completion](/ts-support-3.gif)

Support for interpolation of Resource Keys can prevent translation missing.

Use-cases on your project, you may have Vue components that do not use local scope, but use global scope for everything.

For that use case, you can also support interpolation of resource keys by explicitly specifying the schema defined for the global scope in the type parameter of `useI18n`.

define schema for global scope:

```ts
/**
 * define the resource schema
 */

import enUS from './en-US.json'

// define message schema as master message schema
export type MessageSchema = typeof enUS

// define number format schema
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
```

Then, just import the defined schema and use it as a type parameter of `useI18n`, as in the following Vue component:

```vue
<script lang="ts">
import { useI18n } from 'vue-i18n'

// import resource schema for global scope
import type { MessageSchema, NumberSchema } from '../locales/schema'

const { t, n } = useI18n<{ message: MessageSchema, number: NumberSchema }>({
  useScope: 'global'
})
</script>

<template>
  <p>message: {{ t('hello') }}</p>
  <p>currency: {{ n(1000, 'currency') }}</p>
</template>

```

As a result, you can use the interpolation of resource keys in the APIs provided by VueI18n, such as `t` and `n`.

:::warning NOTICE
Legacy Mode, and interpolation of Resource Keys of APIs such as `$t` and `$d`, which are injected into Component by `globalInjection: true` of Composition API, require explicitly specifying type parameters.

For more details, see the API documentation.
https://vue-i18n.intlify.dev/api/injection.html
:::

## Global resource schema type definition

In VueI18n, you can define resource types at the global scope level by using TypeScript feature to extend interfaces.

If your project uses all resources as global scope, it is very convenient to handle type-safe resources easily.

VueI18n provides the following interfaces:

- `DefineLocaleMessage`: Interface to globally define the schema for Locale messages
- `DefineDateTimeFormat`: Interface to globally define the schema for Datetime formats
- `DefineNumberFormat`: Interface to globally define the schema for Number formats

With using these interfaces and the `declare module`, you can define a global schema for VueI18n.

The following is an example of a global schema defined in `d.ts`:

```ts
/**
 * you need to import the some interfaces
 */
import {
  DefineLocaleMessage,
  DefineDateTimeFormat,
  DefineNumberFormat
} from 'vue-i18n'

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage {
    hello: string
    menu: {
      login: string
    }
    errors: string[]
  }

  // define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      hour: 'numeric'
      minute: 'numeric'
      second: 'numeric'
      timeZoneName: 'short'
      timezone: string
    }
  }

  // define the number format schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency'
      currencyDisplay: 'symbol'
      currency: string
    }
  }
}
```

With using the `declare module` and the interface provided by VueI18n, you can define the schema for global resources.

Previously, when using `createI18n` and `useI18n` with type definitions for global scope resources, it was necessary to specify each as a type parameter.
This way, you don't need to do that.

The following is an example with `createI18n`:

```ts
import { createI18n, type I18nOptions } from 'vue-i18n'

/**
 * import locale messages resource from json for global scope
 */
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

const options: I18nOptions = {
  legacy: false,
  locale: 'ja-JP',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'ja-JP': jaJP
  },
  datetimeFormats: {
    'ja-JP': {
      short: {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timezone: 'Asia/Tokyo'
      }
    }
  },
  numberFormats: {
    'ja-JP': {
      currency: {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: 'JPY'
      }
    }
  }
}

/**
 * setup vue-i18n with i18n resources with global type definition.
 * if you define the i18n resource schema in your `*.d.ts`, these is checked with typeScript.
 */
const i18n = createI18n<false, typeof options>(options)
```

The first type parameter of `createI18n` above does not specify the type that is the schema of the resource. The above just specifies a type hint for the `global` property of the i18n instance created by `createI18n`.
(If `false`, the type is a `Composer` instance for the Composition API, if `true`, the type is a `VueI18n` instance for the legacy API)

The second type parameter of `createI18n` specifies a type hint for options.

In the case of the `useI18n` case used by Vue components, it looks like this:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// use global scope
const { t, d, n } = useI18n({
  inheritLocale: true
})
</script>

<template>
  <p>`t` resource key completion: {{ t('menu.login') }}</p>
  <p>`d` resource key completion: {{ d(new Date(), 'short') }}</p>
  <p>`n` resource key completion: {{ n(1000, 'currency') }}</p>
</template>
```

As you can see from the above code, you don't need to specify anything for the type parameter of `useI18n`. You can interpolate API Resource Keys such as `t`, `d`, and `n` without specifying them.
