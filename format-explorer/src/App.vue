<script lang="ts">
import { defineComponent, ref } from 'vue'
import Navigation from './components/Navigation.vue'
import Editor from './components/Editor.vue'
import { baseCompile } from 'vue-i18n'
import type { CompileError, CompileOptions } from 'vue-i18n'

interface PersistedState {
  src?: string
  options: CompileOptions
}

export default defineComponent({
  name: 'App',

  components: {
    Navigation,
    Editor
  },

  setup() {
    /**
     * states
     */
    const genCodes = ref<string>('')
    const compileErrors = ref<CompileError[]>([])
    const persistedState: PersistedState = JSON.parse(
      decodeURIComponent(window.location.hash.slice(1)) ||
        localStorage.getItem('state') ||
        `{}`
    )
    const initialCodes = persistedState.src || 'hello {name}!'

    /**
     * utilties
     */
    let lastSuccessCode: string
    function compile(message: string): string {
      console.clear()

      try {
        const start = performance.now()

        const errors: CompileError[] = []
        const { code, ast } = baseCompile(message, {
          onError: err => errors.push(err)
        })
        if (errors.length > 0) {
          console.error(errors)
        }

        console.log(`Compiled in ${(performance.now() - start).toFixed(2)}ms.`)
        compileErrors.value = errors
        console.log(`AST: `, ast)

        const evalCode = new Function(`return ${code}`)()
        lastSuccessCode =
          evalCode.toString() + `\n\n// Check the console for the AST`
      } catch (e) {
        lastSuccessCode = `/* ERROR: ${e.message} (see console for more info) */`
        console.error(e)
      }

      return lastSuccessCode
    }

    /**
     * envet handlers
     */
    const onChange = (message: string): void => {
      const state = JSON.stringify({ src: message } as PersistedState)
      localStorage.setItem('state', state)
      window.location.hash = encodeURIComponent(state)
      genCodes.value = compile(message)
    }

    // setup context
    return {
      initialCodes,
      genCodes,
      compileErrors,
      onChange
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="navigation">
      <Navigation class="navigation" />
    </div>
    <div class="operation">
      <Editor
        class="input"
        language="intlify"
        :code="initialCodes"
        :errors="compileErrors"
        :debounce="true"
        @change="onChange"
      />
      <!-- prettier-ignore -->
      <Editor
        class="output"
        :code="genCodes"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.navigation {
  width: 100%;
  height: 5%;
  box-sizing: border-box;
  background-color: var(--bg);
  border-bottom: 1px solid var(--border);
}
.operation {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.input {
  margin-top: 0.6rem;
  flex: 2;
  width: 30%;
  height: 100%;
}
.output {
  margin-top: 0.6rem;
  flex: 3;
  width: 70%;
  height: 100%;
}
</style>
