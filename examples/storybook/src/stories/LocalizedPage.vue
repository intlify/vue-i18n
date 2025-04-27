<template>
  <article>
    <my-header :user="user" @login="onLogin" @logout="onLogout" @create-account="onCreateAccount" />
    <section class="storybook-page">
      <h2>{{ t('pagesInStorybook') }}</h2>
      <p class="localized-msg">
        {{ t('localizationMsg') }}
      </p>
      {{ t('navigating') }}
    </section>
  </article>
</template>

<script lang="ts" setup>
import './page.css'
import MyHeader from './Header.vue'
import { useI18n } from 'vue-i18n'

import { ref } from 'vue'
const { t } = useI18n()

const user = ref<{ name: string } | null>(null)

const onLogin = () => {
  user.value = { name: t('name') }
}
const onLogout = () => {
  user.value = null
}
const onCreateAccount = () => {
  user.value = { name: t('name') }
}
</script>
