<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ScrollAreaViewportProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollAreaContext } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaViewport',
})

const props = defineProps<ScrollAreaViewportProps>()
const api = useScrollAreaContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getViewportProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
