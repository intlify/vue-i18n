<template>
  <form>
    <label for="locale-select">select language: </label>
    <select id="locale-select" v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
  <i18n-host .locale="locale">
    <h1>Vue I18n in Web component</h1>
    <hello-i18n />
    <hello-block />
  </i18n-host>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const locale = ref<string>('en')
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
