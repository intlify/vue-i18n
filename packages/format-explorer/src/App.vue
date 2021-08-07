<script lang="ts">
import { defineComponent, ref } from 'vue'
import Navigation from './components/Navigation.vue'
import Editor from './components/Editor.vue'
import { baseCompile } from '@intlify/message-compiler'
import * as monaco from 'monaco-editor'
import { debounce } from './utils'
import { SourceMapConsumer } from 'source-map'
import type { CompileError, CompileOptions } from '@intlify/message-compiler'

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
    let lastSuccessfulMap: SourceMapConsumer | undefined
    async function compile(message: string): Promise<string> {
      console.clear()

      try {
        const start = performance.now()

        const errors: CompileError[] = []
        const options = {
          sourceMap: true,
          onError: (err: CompileError) => errors.push(err)
        }
        const { code, ast, map } = baseCompile(message, options)
        if (errors.length > 0) {
          console.error(errors)
        }

        console.log(`Compiled in ${(performance.now() - start).toFixed(2)}ms.`)
        compileErrors.value = errors
        console.log(`AST: `, ast)
        console.log('sourcemap', map)

        const evalCode = new Function(`return ${code}`)()
        lastSuccessCode =
          evalCode.toString() + `\n\n// Check the console for the AST`
        lastSuccessfulMap = await new SourceMapConsumer(map!)
        lastSuccessfulMap!.computeColumnSpans()
      } catch (e) {
        lastSuccessCode = `/* ERROR: ${e.message} (see console for more info) */`
        console.error(e)
      }

      return lastSuccessCode
    }

    /**
     * envet handlers
     */

    let inputEditor: monaco.editor.IStandaloneCodeEditor | null = null
    let outputEditor: monaco.editor.IStandaloneCodeEditor | null = null

    // input editor model change event
    const onChangeModel = async (message: string): Promise<void> => {
      const state = JSON.stringify({ src: message } as PersistedState)
      localStorage.setItem('state', state)
      window.location.hash = encodeURIComponent(state)
      genCodes.value = await compile(message)
    }

    // highlight output codes
    let prevOutputDecos: string[] = []
    function clearOutputDecos() {
      if (!outputEditor) {
        return
      }
      prevOutputDecos = outputEditor.deltaDecorations(prevOutputDecos, [])
    }

    let prevInputDecos: string[] = []
    function clearInputDecos() {
      if (!inputEditor) {
        return
      }
      prevInputDecos = inputEditor.deltaDecorations(prevInputDecos, [])
    }

    // input editor ready event
    const onReadyInput = (editor: monaco.editor.IStandaloneCodeEditor) => {
      inputEditor = editor
      inputEditor.onDidChangeCursorPosition(
        debounce(e => {
          clearInputDecos()
          if (lastSuccessfulMap) {
            const pos = lastSuccessfulMap.generatedPositionFor({
              source: 'message.intl',
              line: e.position.lineNumber,
              column: e.position.column
            })
            if (pos.line != null && pos.column != null) {
              prevOutputDecos = outputEditor!.deltaDecorations(
                prevOutputDecos,
                [
                  {
                    range: new monaco.Range(
                      pos.line,
                      pos.column + 1,
                      pos.line,
                      pos.lastColumn ? pos.lastColumn + 2 : pos.column + 2
                    ),
                    options: {
                      inlineClassName: `highlight`
                    }
                  }
                ]
              )
              outputEditor!.revealPositionInCenter({
                lineNumber: pos.line,
                column: pos.column + 1
              })
            } else {
              clearOutputDecos()
            }
          }
        }, 100)
      )
    }

    // output editor ready event
    const onReadyOutput = (editor: monaco.editor.IStandaloneCodeEditor) => {
      outputEditor = editor
      editor.onDidChangeCursorPosition(
        debounce(e => {
          clearOutputDecos()
          if (lastSuccessfulMap) {
            const pos = lastSuccessfulMap.originalPositionFor({
              line: e.position.lineNumber,
              column: e.position.column
            })
            console.log('onReadyOutput', e.position, pos)
            if (
              pos.line != null &&
              pos.column != null &&
              !(
                // ignore mock location
                (pos.line === 1 && pos.column === 0)
              )
            ) {
              const translatedPos = {
                column: pos.column + 1,
                lineNumber: pos.line
              }
              prevInputDecos = inputEditor!.deltaDecorations(prevInputDecos, [
                {
                  range: new monaco.Range(
                    pos.line,
                    pos.column + 1,
                    pos.line,
                    pos.column + 1
                  ),
                  options: {
                    isWholeLine: true,
                    className: `highlight`
                  }
                }
              ])
              inputEditor!.revealPositionInCenter(translatedPos)
            } else {
              clearInputDecos()
            }
          }
        }, 100)
      )
    }

    // setup context
    return {
      initialCodes,
      genCodes,
      compileErrors,
      onChangeModel,
      onReadyInput,
      onReadyOutput
    }
  }
})
</script>

<template>
  <div class="container">
    <nav class="navigation">
      <Navigation class="navigation" />
    </nav>
    <div class="operation">
      <Editor
        class="input"
        language="intlify"
        :code="initialCodes"
        :errors="compileErrors"
        :debounce="true"
        @change-model="onChangeModel"
        @ready="onReadyInput"
      />
      <Editor class="output" :code="genCodes" @ready="onReadyOutput" />
    </div>
  </div>
</template>

<style>
body {
  --bg: #1d1f21;
  --fg: #fff;
  --border: #333;
  --in-bg: white;
  --in-fg: black;
  --in-border: #666;
  margin: 0;
  background-color: var(--bg);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--fg);
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.highlight {
  background-color: rgba(46, 120, 190, 0.5);
}

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
  display: contents;
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
