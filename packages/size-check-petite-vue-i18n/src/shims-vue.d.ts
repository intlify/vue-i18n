declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  // @ts-ignore -- NOTE(kazupon): for Vue SFC types
  export default component
}
