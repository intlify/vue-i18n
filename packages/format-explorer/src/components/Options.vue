<script setup lang="ts">
import { reactive, watch, watchEffect } from 'vue'
import type { CompileOptions } from '@intlify/message-compiler'

/*
  location?: boolean
  mode?: 'normal' | 'arrow' // default normal
  breakLineCode?: '\n' | ';' // default newline
  needIndent?: boolean // default true
  onError?: CompileErrorHandler
  // Generate source map?
  // - Default: false
  sourceMap?: boolean
  // Filename for source map generation.
  // - Default: `message.intl`
  filename?: string
*/
const compilerOptions = reactive<CompileOptions>({
  mode: 'normal',
  location: true,
  needIndent: true,
  sourceMap: true,
  jit: false,
  optimize: true
})

const emit = defineEmits<{
  change: [options: CompileOptions]
}>()

watch(compilerOptions, (val, old) => {
  console.log('watch compilerOptions', val)
  emit('change', val)
})
</script>

<template>
  <div class="options-wrapper">
    <div class="options-label">
      Options ↘
      <ul class="options">
        <li>
          <span>Mode:</span>
          <input
            id="mode-normal"
            type="radio"
            name="mode"
            :checked="compilerOptions.mode === 'normal'"
            @change="compilerOptions.mode = 'normal'"
          />
          <label for="mode-normal">normal</label>
          <input
            id="mode-arrow"
            type="radio"
            name="mode"
            :checked="compilerOptions.mode === 'arrow'"
            @change="compilerOptions.mode = 'arrow'"
          />
          <label for="mode-arrow">arrow</label>
        </li>
        <li>
          <input
            id="location"
            type="checkbox"
            name="location"
            :checked="compilerOptions.location"
            @change="
              compilerOptions.location = (
                $event.target as HTMLInputElement
              ).checked
            "
          />
          <label for="location">location</label>
        </li>
        <li>
          <input
            id="indent"
            type="checkbox"
            name="indent"
            :checked="compilerOptions.needIndent"
            @change="
              compilerOptions.needIndent = (
                $event.target as HTMLInputElement
              ).checked
            "
          />
          <label for="indent">needIndent</label>
        </li>
        <li>
          <input
            id="sourcemap"
            type="checkbox"
            name="sourcemap"
            :checked="compilerOptions.sourceMap"
            @change="
              compilerOptions.sourceMap = (
                $event.target as HTMLInputElement
              ).checked
            "
          />
          <label for="sourcemap">sourceMap</label>
        </li>
        <li>
          <input
            id="jit"
            type="checkbox"
            name="jit"
            :checked="compilerOptions.jit"
            @change="
              compilerOptions.jit = ($event.target as HTMLInputElement).checked
            "
          />
          <label for="jit">jit</label>
        </li>
        <li>
          <input
            id="optimize"
            type="checkbox"
            name="optimize"
            :checked="compilerOptions.optimize"
            @change="
              compilerOptions.optimize = (
                $event.target as HTMLInputElement
              ).checked
            "
          />
          <label for="optimize">optimize</label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.options-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.options-wrapper:hover .options {
  display: block;
}

.options-label {
  cursor: pointer;
  text-align: right;
  padding-right: 10px;
  font-weight: bold;
}

.options {
  display: none;
  margin-top: 15px;
  list-style-type: none;
  background-color: var(--bg);
  border: 1px solid var(--border);
  padding: 15px 30px;
}

.options li {
  margin: 8px 0;
}
</style>
