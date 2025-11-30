<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface FieldInputProps
  extends PolymorphicProps,
  /**
   * @vue-ignore
   */
  Omit<InputHTMLAttributes, 'value'> {
    modelValue?: InputHTMLAttributes['value']
  }
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldInput'
})

defineProps<FieldInputProps>()
const field = useFieldContext()

const emit = defineEmits(['update:modelValue'])

useForwardExpose()
</script>

<template>
  <ui.input
    v-bind="field.getInputProps()"
    :as-child
    :value="modelValue"
    @input="(event) => emit('update:modelValue', (event.target as HTMLInputElement).value)"
  >
    <slot />
  </ui.input>
</template>
