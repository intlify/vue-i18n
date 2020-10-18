<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue'
import theme from '../theme'
import { debounce } from '../utils'
import * as monaco from 'monaco-editor'
import type { PropType } from 'vue'
import type { CompileError } from 'vue-i18n'

export default defineComponent({
  name: 'Editor',

  props: {
    code: {
      type: String,
      default: () => ''
    },
    debounce: {
      type: Boolean,
      default: () => false
    },
    language: {
      type: String,
      default: () => 'javascript'
    },
    errors: {
      type: Array as PropType<CompileError[]>,
      default: () => []
    }
  },

  emits: {
    ready: null,
    'change-model': null
  },

  setup(props, { emit }) {
    const container = ref<HTMLElement | null>(null)

    function formatError(err: CompileError) {
      const loc = err.location!
      return {
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: loc.start.line,
        startColumn: loc.start.column,
        endLineNumber: loc.end.line,
        endColumn: loc.end.column,
        message: `intlify message compilation error: ${err.message}`,
        code: String(err.code)
      }
    }

    onMounted(() => {
      if (container.value == null) {
        return
      }

      monaco.editor.defineTheme('my-theme', theme)
      monaco.editor.setTheme('my-theme')

      const editor = monaco.editor.create(container.value, {
        value: [props.code].join('\n'),
        wordWrap: 'bounded',
        language: props.language,
        fontSize: 14,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        tabSize: 2,
        minimap: {
          enabled: false
        }
      })
      window.addEventListener('resize', () => editor.layout())

      const changeEmitter = props.debounce
        ? debounce(() => emit('change-model', editor.getValue()))
        : () => emit('change-model', editor.getValue())

      editor.onDidChangeModelContent(changeEmitter)

      watchEffect(() => editor.setValue(props.code!))
      watchEffect(() => {
        monaco.editor.setModelMarkers(
          editor.getModel()!,
          `vue-i18n`,
          props.errors.filter(e => e.location).map(formatError)
        )
      })

      emit('ready', editor)
    })

    return { container }
  }
})
</script>

<template>
  <div ref="container" />
</template>
