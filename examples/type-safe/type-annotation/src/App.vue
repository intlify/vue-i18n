<script setup lang="ts">
import LocalScope from './components/LocalScope.vue'
import GlobalScope from './components/GlobalScope.vue'
</script>

<template>
  <LocalScope />
  <GlobalScope />
</template>

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
