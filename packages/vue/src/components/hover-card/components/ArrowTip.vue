<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface HoverCardArrowTipProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useHoverCardContext } from '../composables/use-hover-card-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'HoverCardArrowTip',
})

defineProps<HoverCardArrowTipProps>()
const hoverCard = useHoverCardContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="hoverCard.getArrowTipProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
