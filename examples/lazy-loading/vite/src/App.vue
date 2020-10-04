<template>
  <nav>
    <div class="navigation">
      <router-link :to="{ name: 'home', params: { locale } }">
        {{ $t('navigations.home') }}
      </router-link>
      |
      <router-link :to="{ name: 'about', params: { locale } }">
        {{ $t('navigations.about') }}
      </router-link>
    </div>
    <form class="language">
      <label>{{ $t('labels.language') }}</label>
      <select v-model="locale">
        <option value="en">en</option>
        <option value="ja">ja</option>
      </select>
    </form>
  </nav>
  <router-view></router-view>
</template>

<script>
import { ref, watch, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    const locale = ref('en')
    const router = useRouter()
    const route = useRoute()

    // when change the locale, go to locale route
    watch(locale, val => {
      router.push({
        name: route.name,
        params: { locale: val }
      })
    })

    return { locale }
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
