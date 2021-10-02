<script setup>
import { useI18n } from 'vue-i18n'
import { SUPPORT_LOCALES } from './i18n'

const { locale } = useI18n()
</script>

<template>
  <div>
    <router-link to="/">{{ $t('menu.home') }}</router-link> |
    <router-link to="/about">{{ $t('menu.about') }}</router-link> |
    <router-link to="/external">{{ $t('menu.external') }}</router-link> |
    <form class="language">
      <label for="locale-select">{{ $t('menu.language') }}</label>
      <select id="locale-select" v-model="locale">
        <option
          v-for="availableLocale in SUPPORT_LOCALES"
          :key="availableLocale"
          :value="availableLocale"
        >
          {{ availableLocale }}
        </option>
      </select>
    </form>
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </div>
</template>

<style>
@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('./assets/fonts/Inter-Italic.woff2#iefix') format('woff2'),
    url('./assets/fonts/Inter-Italic.woff') format('woff');
}
.inter {
  font-family: 'Inter';
}
.language {
  display: inline-block;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
