<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

// Avoid expanding the native autocomplete union through Vue's slot constructor.
// Required retains each supported Vue version's explicit-undefined contract.
type NativeAutocomplete = Required<InputHTMLAttributes>['autocomplete']
interface FieldInputHTMLAttributes extends Omit<InputHTMLAttributes, 'value' | 'autocomplete'> {
  autocomplete?: NonNullable<NativeAutocomplete> | (undefined extends NativeAutocomplete ? undefined : never)
}

export interface FieldInputProps
  extends PolymorphicProps,
  /**
   * @vue-ignore
   */
  FieldInputHTMLAttributes {
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
    @input="(event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value)"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </ui.input>
</template>
