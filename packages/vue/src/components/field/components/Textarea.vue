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
import { watchEffect } from 'vue'
import { useForwardExpose } from '~/composables'
import { useFieldContext } from '../composables/use-field-context'
import { ui } from '~/factory'

defineOptions({
  name: 'FieldTextarea'
})

const props = defineProps<FieldTextareaProps>()
const field = useFieldContext()
const emit = defineEmits(['update:modelValue'])

const { forwardRef, currentElement } = useForwardExpose()

watchEffect((onCleanup) => {
  const element = currentElement.value
  if (!props.autoresize || !element || element.tagName !== 'TEXTAREA')
    return

  const cleanup = autoresizeTextarea(element as HTMLTextAreaElement)
  if (cleanup)
    onCleanup(cleanup)
}, { flush: 'post' })
</script>

<template>
  <ui.textarea
    :ref="forwardRef"
    v-bind="field.getTextareaProps()"
    :as-child="props.asChild"
    :value="modelValue"
    @input="(event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value)"
    :style="props.autoresize ? { resize: 'none', overflow: 'hidden' } : undefined"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </ui.textarea>
</template>
