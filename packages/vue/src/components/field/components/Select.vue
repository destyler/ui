<script lang="ts">
import type { SelectHTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface FieldSelectBaseProps extends PolymorphicProps {}
export interface FieldSelectProps
  extends FieldSelectBaseProps,
  /**
   * @vue-ignore
   */
  Omit<SelectHTMLAttributes, 'value'> {
    modelValue?: SelectHTMLAttributes['value']
  }
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldContext } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldSelect'
})

defineProps<FieldSelectProps & { modelValue?: string }>()
const field = useFieldContext()

const emit = defineEmits(['update:modelValue'])

useForwardExpose()
</script>

<template>
  <ui.select
    v-bind="field.getSelectProps()"
    :value="modelValue"
    @change="(event) => emit('update:modelValue', (event.target as HTMLSelectElement).value)"
    :as-child
  >
    <slot />
  </ui.select>
</template>
