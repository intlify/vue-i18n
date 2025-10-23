declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>
  // @ts-ignore -- NOTE(kazupon): for Vue SFC style import
  export default component
}
