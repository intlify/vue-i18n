<script lang="tsx">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup({ msg }) {
    const { t } = useI18n({
      useScope: 'global',
      inheritLocale: true
    })
    return () => (
      <>
        <h1>{msg}</h1>
        <p>v-t: <span v-t="hello"></span></p>
        <i18n-t keypath="term" tag="label" for="tos">
          <a href="https://vue-i18n.intlify.dev" target="_blank">{ t('tos') }</a>
        </i18n-t>
      </>
    )
  }
})
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
