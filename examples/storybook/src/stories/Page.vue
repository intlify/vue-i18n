<template>
  <article>
    <my-header :user="user" @login="onLogin" @logout="onLogout" @create-account="onCreateAccount" />
    <section class="storybook-page">
      <h2>{{ t('pagesInStorybook') }}</h2>
      <i18n-t keypath="recommendBuildingUIs" tag="p">
        <template #link>
          <a href="https://componentdriven.org" target="_blank" rel="noopener noreferrer">
            <strong>{{ t('componentDriven') }}</strong>
          </a>
        </template>
      </i18n-t>
      <p>{{ t('renderPagesWithMockData') }}</p>
      <ul>
        <li>{{ t('useHigherLevelConnectedComponent') }}</li>
        <li>{{ t('assembleDataFromServices') }}</li>
      </ul>
      <p>
        {{ t('guidedTutorial') }}
        <a href="https://storybook.js.org/tutorials/" target="_blank" rel="noopener noreferrer">
          {{ t('storybookTutorials') }}
        </a>
        {{ t('readMoreDocs') }}
        <a href="https://storybook.js.org/docs" target="_blank" rel="noopener noreferrer">
          {{ t('docs') }}
        </a>
      </p>
      <div class="tip-wrapper">
        <span class="tip">{{ t('tip') }}</span>
        <i18n-t keypath="adjustCanvasWidth">
          <template #icon>
            <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path
                  d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0 01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0 010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z"
                  id="a"
                  fill="#999"
                />
              </g>
            </svg>
          </template>
        </i18n-t>
      </div>
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
