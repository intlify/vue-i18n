<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  onUnmounted,
  watchEffect
} from 'vue'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import theme from '../theme'
import { debounce } from '../utils'
import type { PropType } from 'vue'
import type { CompileError } from '@intlify/message-compiler'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new JsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}

const props = defineProps({
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
})

const emit = defineEmits({
  ready: null,
  'change-model': null
})

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

let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
  if (container.value == null) {
    return
  }

  monaco.editor.defineTheme('my-theme', theme)
  monaco.editor.setTheme('my-theme')

  editor = monaco.editor.create(container.value, {
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

  if (editor == null) {
    throw new Error('editor is null')
  }

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

onUnmounted(() => {
  editor.dispose()
})
</script>

<template>
  <div ref="container" />
</template>
