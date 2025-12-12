<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface NumberInputRootProps extends RootProps, PolymorphicProps {}
export interface NumberInputRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInput } from '../composables/use-number-input'
import { NumberInputProvider } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputRoot',
})

const props = withDefaults(defineProps<NumberInputRootProps>(), {
  allowMouseWheel: undefined,
  allowOverflow: undefined,
  clampValueOnBlur: undefined,
  disabled: undefined,
  focusInputOnChange: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
  spinOnPress: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<NumberInputRootEmits>()

const numberInput = useNumberInput(props, emits)
NumberInputProvider(numberInput)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="numberInput.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
