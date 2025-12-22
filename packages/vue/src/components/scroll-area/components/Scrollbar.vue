<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { ScrollbarProps } from '../types'

export interface ScrollAreaScrollbarProps extends ScrollbarProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollAreaContext } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaScrollbar',
})

const props = withDefaults(defineProps<ScrollAreaScrollbarProps>(), {
  orientation: 'vertical',
})
const api = useScrollAreaContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getScrollbarProps({ orientation: props.orientation })" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
