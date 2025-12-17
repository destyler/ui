<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TooltipArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTooltipContext } from '../composables/use-tooltip-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TooltipArrow'
})

defineProps<TooltipArrowProps>()
const tooltip = useTooltipContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tooltip.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
