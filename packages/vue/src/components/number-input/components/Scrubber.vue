<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputScrubberProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputScrubber',
})

defineProps<NumberInputScrubberProps>()
const numberInput = useNumberInputContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="numberInput.getScrubberProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
