<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TooltipContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useTooltipContext } from '../composables/use-tooltip-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TooltipContent'
})

defineProps<TooltipContentProps>()

const tooltip = useTooltipContext()
const presence = usePresenceContext()

const mergedProps = computed(() => mergeProps(tooltip.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
