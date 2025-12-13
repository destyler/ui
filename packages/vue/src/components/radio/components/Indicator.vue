<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface RadioIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadioContext } from '../composables/use-radio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioIndicator'
})

defineProps<RadioIndicatorProps>()
const radio = useRadioContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="radio.getIndicatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
