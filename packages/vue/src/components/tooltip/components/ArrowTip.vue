<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TooltipArrowTipProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTooltipContext } from '../composables/use-tooltip-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TooltipArrowTip'
})

defineProps<TooltipArrowTipProps>()
const tooltip = useTooltipContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tooltip.getArrowTipProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
