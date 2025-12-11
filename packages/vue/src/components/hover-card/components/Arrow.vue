<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface HoverCardArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useHoverCardContext } from '../composables/use-hover-card-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'HoverCardArrow',
})

defineProps<HoverCardArrowProps>()
const hoverCard = useHoverCardContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="hoverCard.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
