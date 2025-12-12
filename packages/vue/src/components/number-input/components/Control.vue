<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputControl',
})

defineProps<NumberInputControlProps>()
const numberInput = useNumberInputContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="numberInput.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
