<script setup lang="ts">
import { VPButton } from 'vitepress/theme';
const actionLink = 'https://github.com/sponsors/kazupon'
const text = 'Become a sponsor'
</script>

<template>
  <div class="sponsor-kit" align="center">
    <div class="container">
      <div class="header">
        <div class="love">
          <span class="vpi-heart icon" />
        </div>
        <h2 class="message">Vue I18n is free and open source, made possible by wonderful sponsors!</h2>
      </div>
      <div class="sponsors">
        <a href="https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg">
          <img src="https://cdn.jsdelivr.net/gh/kazupon/sponsors/sponsors.svg" />
        </a>
      </div>
    </div>
    <div class="action">
      <VPButton theme="sponsor" :text="text" :href="actionLink" />
    </div>
  </div>
</template>

<style scoped>
.sponsor-kit {
  border-top: 1px solid var(--vp-c-gutter);
  padding-top: 88px !important;
}

.sponsor-kit {
  margin: 96px 0;
}

@media (min-width: 768px) {
  .sponsor-kit {
    margin: 128px 0;
  }
}

.sponsor-kit {
  padding: 0 24px;
}

@media (min-width: 768px) {
  .sponsor-kit {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .sponsor-kit {
    padding: 0 64px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.love {
  margin: 0 auto;
  width: fit-content;
  font-size: 28px;
  color: var(--vp-c-text-3);
}

.icon {
  display: inline-block;
}

.message {
  margin: 0 auto;
  padding-top: 10px;
  max-width: 320px;
  text-align: center;
  line-height: 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.sponsors {
  padding-top: 32px;
}

.action {
  padding-top: 40px;
  text-align: center;
}
</style>
