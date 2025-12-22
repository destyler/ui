<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { ThumbProps } from '../types'

export interface ScrollAreaThumbProps extends ThumbProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollAreaContext } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaThumb',
})

const props = withDefaults(defineProps<ScrollAreaThumbProps>(), {
  orientation: 'vertical',
})
const api = useScrollAreaContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getThumbProps({ orientation: props.orientation })" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
