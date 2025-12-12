<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputLabel',
})

defineProps<NumberInputLabelProps>()
const numberInput = useNumberInputContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="numberInput.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
