<template>
  <button type="button" :class="classes" @click="onClick" :style="style">
    {{ translatedLabel }}
  </button>
</template>

<script lang="ts" setup>
import './button.css'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label: string
    /**
     * primary or secondary button
     */
    primary?: boolean
    /**
     * size of the button
     */
    size?: 'small' | 'medium' | 'large'
    /**
     * background color of the button
     */
    backgroundColor?: string
  }>(),
  { primary: false },
)

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const classes = computed(() => ({
  'storybook-button': true,
  'storybook-button--primary': props.primary,
  'storybook-button--secondary': !props.primary,
  [`storybook-button--${props.size || 'medium'}`]: true,
}))

const translatedLabel = computed(() => {
  if (props.label === 'Button') {
    return t(props.label)
  } else {
    return props.label
  }
})

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}))

const onClick = () => {
  emit('click', 1)
}
</script>
