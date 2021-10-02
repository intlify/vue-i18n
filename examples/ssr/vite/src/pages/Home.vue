<template>
  <h1>{{ $t('pages.home.title') }}</h1>
  <p>
    <img src="../assets/logo.png" alt="logo" />
  </p>
  <button @click="state.count++">
    {{ $t('pages.home.count', { value: state.count }) }}
  </button>
  <Foo />
  <p class="virtual">{{ $t('pages.home.virtual', { msg: foo.msg }) }}</p>
  <p class="inter">{{ $t('pages.home.inter') }}</p>

  <ImportType />
</template>

<script setup>
import foo from '@foo'
import { reactive, defineAsyncComponent } from 'vue'
const ImportType = load('ImportType')
const Foo = defineAsyncComponent(() =>
  import('../components/Foo').then(mod => mod.Foo)
)
function load(file) {
  return defineAsyncComponent(() => import(`../components/${file}.vue`))
}
const state = reactive({ count: 0 })
</script>

<style scoped>
h1,
a {
  color: green;
}
</style>
