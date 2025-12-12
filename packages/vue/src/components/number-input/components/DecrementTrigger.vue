<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputDecrementTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputDecrementTrigger',
})

defineProps<NumberInputDecrementTriggerProps>()
const numberInput = useNumberInputContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="numberInput.getDecrementTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
