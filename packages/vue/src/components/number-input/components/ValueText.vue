<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputValueText',
})

defineProps<NumberInputValueTextProps>()
const numberInput = useNumberInputContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="numberInput.getValueTextProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
