<script lang="tsx">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'global'
    })
    return () => (
      <>
        <HelloWorld msg="Vue I18n v9 + TSX + Vite" />
        <p>{ t('hello') }</p>
      </>
    )
  }
})
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
