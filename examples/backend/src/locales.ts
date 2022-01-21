import type { Locale, LocaleMessages } from 'vue-i18n'
import type { ResourceSchema } from '../db/message'

const _default = (r: any) => r.default || r

export async function load<Locales>(locales: readonly Locale[]) {
  const messages: Record<string, any> = {}
  for (const locale of locales) {
    // prettier-ignore
    if (import.meta.env.DEV) { // for development
      // load from back-end server
      const resource = await (await fetch(`/api/resources/${locale}`)).json()
      messages[locale] = resource
    } else { // for production
      // load from assets
      const resource = _default(await import(`../public/${locale}.js`))
      messages[locale] = resource
    }
  }
  return messages as LocaleMessages<ResourceSchema, Locales>
}
