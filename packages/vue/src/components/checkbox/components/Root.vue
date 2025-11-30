<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface CheckboxRootProps extends RootProps, PolymorphicProps {}
export interface CheckboxRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCheckbox } from '../composables/use-checkbox'
import { CheckboxProvider } from '../composables/use-checkbox-context'
import { useForwardExpose } from '~/composables'

const props = withDefaults(defineProps<CheckboxRootProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<CheckboxRootEmits>()

const checkbox = useCheckbox(props, emits)
CheckboxProvider(checkbox)

useForwardExpose()
</script>

<template>
  <ui.label v-bind="checkbox.getRootProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
