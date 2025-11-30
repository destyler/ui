<script lang="ts">
import type { TextareaHTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface FieldTextareaBaseProps extends PolymorphicProps {
  /**
   * Whether the textarea should autoresize
   * @default false
   */
  autoresize?: boolean
}
export interface FieldTextareaProps
  extends FieldTextareaBaseProps,
  /**
   * @vue-ignore
   */
  Omit<TextareaHTMLAttributes, 'value'> {
    modelValue?: TextareaHTMLAttributes['value']
  }
</script>

<script setup lang="ts">
import { autoresizeTextarea } from '@destyler/auto-resize'
import { useForwardExpose } from '~/composables'
import { useFieldContext } from '../composables/use-field-context'
import { ui } from '~/factory'

const props = defineProps<FieldTextareaProps>()
const field = useFieldContext()
const emit = defineEmits(['update:modelValue'])

useForwardExpose()
</script>

<!-- TODO use ark.textarea -->
<template>
  <ui.textarea
    :ref="autoresizeTextarea"
    v-bind="field.getTextareaProps()"
    :value="modelValue"
    @input="(event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value)"
    :style="props.autoresize ? { resize: 'none', overflow: 'hidden' } : undefined"
  >
    <slot />
  </ui.textarea>
</template>
