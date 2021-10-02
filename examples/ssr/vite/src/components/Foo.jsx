import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import './foo.css'

// named exports w/ variable declaration: ok
export const Foo = defineComponent({
  name: 'Foo',
  setup() {
    const { t } = useI18n({
      useScope: 'global',
      inheritLocale: true
    })
    return () => <div class="jsx">{t('components.Foo')}</div>
  }
})
