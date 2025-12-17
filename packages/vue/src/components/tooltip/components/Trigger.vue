<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TooltipTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTooltipContext } from '../composables/use-tooltip-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TooltipTrigger'
})

defineProps<TooltipTriggerProps>()
const tooltip = useTooltipContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="tooltip.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
