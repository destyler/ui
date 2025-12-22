<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ScrollAreaCornerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollAreaContext } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaCorner',
})

const props = defineProps<ScrollAreaCornerProps>()
const api = useScrollAreaContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getCornerProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
