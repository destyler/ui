<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface HoverCardTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useHoverCardContext } from '../composables/use-hover-card-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'HoverCardTrigger',
})

defineProps<HoverCardTriggerProps>()
const hoverCard = useHoverCardContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="hoverCard.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
