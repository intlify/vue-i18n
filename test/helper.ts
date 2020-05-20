import {
  Component,
  createApp,
  defineComponent,
  h,
  ComponentPublicInstance,
  reactive,
  nextTick,
  onMounted,
  ComponentObjectPropsOptions,
  App,
  VNode,
  shallowRef,
  ComponentOptions
} from 'vue'
import { compile } from '@vue/compiler-dom'
import * as runtimeDom from '@vue/runtime-dom'
import { I18n } from '../src/i18n'

export interface MountOptions {
  propsData: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  provide: Record<string | symbol, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  components: ComponentOptions['components']
  slots: Record<string, string>
}

interface Wrapper {
  app: App
  vm: ComponentPublicInstance
  rootEl: HTMLDivElement
  setProps(props: MountOptions['propsData']): Promise<void>
  html(): string
  find: typeof document['querySelector']
}

function initialProps<P>(propsOption: ComponentObjectPropsOptions<P>) {
  const copy = {} as ComponentPublicInstance<typeof propsOption>['$props']

  for (const key in propsOption) {
    const prop = propsOption[key]
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (!prop.required && prop.default)
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      copy[key] = prop.default
  }

  return copy
}

// cleanup wrappers after a suite runs
let activeWrapperRemovers: Array<() => void> = []
afterAll(() => {
  activeWrapperRemovers.forEach(remove => remove())
  activeWrapperRemovers = []
})

export function mount(
  targetComponent: Parameters<typeof createApp>[0],
  i18n: I18n,
  options: Partial<MountOptions> = {}
): Promise<Wrapper> {
  const TargetComponent = targetComponent as Component
  return new Promise(resolve => {
    // NOTE: only supports props as an object
    const propsData = reactive(
      Object.assign(
        initialProps(TargetComponent.props || {}),
        options.propsData
      )
    )

    function setProps(partialProps: Record<string, any>) {
      Object.assign(propsData, partialProps)
      return nextTick()
    }

    const slots: Record<string, (propsData: any) => VNode> = {}

    const Wrapper = defineComponent({
      setup(_props, { emit }) {
        const componentInstanceRef = shallowRef<ComponentPublicInstance>()

        return () => {
          return h(
            TargetComponent,
            {
              ref: componentInstanceRef,
              onVnodeMounted() {
                emit('ready', componentInstanceRef.value)
              },
              ...propsData
            },
            slots
          )
        }
      }
    })

    const app = createApp(Wrapper, {
      onReady: (instance: ComponentPublicInstance) => {
        resolve({ app, vm: instance, rootEl, setProps, html, find })
      }
    })

    if (options.provide) {
      const keys = getKeys(options.provide)

      for (const key of keys) {
        app.provide(key, options.provide[key as any])
      }
    }

    if (options.components) {
      for (const key in options.components) {
        app.component(key, options.components[key])
      }
    }

    if (options.slots) {
      for (const key in options.slots) {
        slots[key] = compileSlot(options.slots[key])
      }
    }

    const rootEl = document.createElement('div')
    document.body.appendChild(rootEl)

    function html() {
      return rootEl.innerHTML
    }

    function find(selector: string) {
      return rootEl.querySelector(selector)
    }

    app.use(i18n)

    app.mount(rootEl)

    activeWrapperRemovers.push(() => {
      app.unmount(rootEl)
      rootEl.remove()
    })
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getKeys(object: Record<string | symbol, any>): Array<symbol | string> {
  return (Object.getOwnPropertyNames(object) as Array<string | symbol>).concat(
    Object.getOwnPropertySymbols(object)
  )
}

function compileSlot(template: string) {
  const codegen = compile(template, {
    mode: 'function',
    hoistStatic: true,
    prefixIdentifiers: true
  })

  const render = new Function('Vue', codegen.code)(runtimeDom)

  const ToRender = defineComponent({
    inheritAttrs: false,
    render,
    setup(props, { attrs }) {
      return { ...attrs }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (propsData: any) => h(ToRender, { ...propsData })
}
