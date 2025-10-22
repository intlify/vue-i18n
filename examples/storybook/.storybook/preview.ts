import type { Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { createI18n } from 'vue-i18n'
import en from '../src/locales/en.json'
import fr from '../src/locales/fr.json'
import type { I18n } from 'vue-i18n'

const i18n: I18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})

setup(app => {
  app.use(i18n)
})

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'fr', title: 'French' }
      ],
      showName: true
    }
  }
}

// Decorator for updating locale
export const decorators = [
  (story, { globals }) => {
    const currentLocale = globals.locale

    if (i18n.global.locale.value !== currentLocale) {
      i18n.global.locale.value = currentLocale
    }

    return {
      components: { story },
      template: '<story />'
    }
  }
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
