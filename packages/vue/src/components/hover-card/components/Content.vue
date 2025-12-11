<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface HoverCardContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { usePresenceContext } from '~/components/presence'
import { ui } from '~/factory'
import { useHoverCardContext } from '../composables/use-hover-card-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'HoverCardContent',
})

defineProps<HoverCardContentProps>()

const hoverCard = useHoverCardContext()
const presence = usePresenceContext()

const mergedProps = computed(() => mergeProps(hoverCard.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
