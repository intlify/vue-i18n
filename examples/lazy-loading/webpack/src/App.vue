<template>
  <nav>
    <div class="navigation">
      <router-link :to="{ name: 'home', params: { locale } }">
        {{ t('navigations.home') }}
      </router-link>
      |
      <router-link :to="{ name: 'about', params: { locale } }">
        {{ t('navigations.about') }}
      </router-link>
    </div>
    <form class="language">
      <label>{{ t('labels.language') }}</label>
      <select v-model="currentLocale">
        <option
          v-for="optionLocale in supportLocales"
          :key="optionLocale"
          :value="optionLocale"
        >
          {{ optionLocale }}
        </option>
      </select>
    </form>
  </nav>
  <router-view />
</template>

<script>
import { defineComponent, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES } from './i18n'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    const { t, locale } = useI18n({ useScope: 'global' })

    /**
     * select locale value for language select form
     *
     * If you use the vue-i18n composer `locale` property directly, it will be re-rendering component when this property is changed,
     * before dynamic import was used to asynchronously load and apply locale messages
     * To avoid this, use the anoter locale reactive value.
     */
    const currentLocale = ref(locale.value)

    // sync to switch locale from router locale path
    watch(router.currentRoute, route => {
      currentLocale.value = route.params.locale
    })

    /**
     * when change the locale, go to locale route
     *
     * when the changes are detected, load the locale message and set the language via vue-router navigation guard.
     * change the vue-i18n locale too.
     */
    watch(currentLocale, val => {
      router.push({
        name: router.currentRoute.value.name,
        params: { locale: val }
      })
    })

    return { t, locale, currentLocale, supportLocales: SUPPORT_LOCALES }
  }
})
</script>

<style scoped>
nav {
  display: inline-flex;
}
.navigation {
  margin-right: 1rem;
}
.language label {
  margin-right: 1rem;
}
</style>
