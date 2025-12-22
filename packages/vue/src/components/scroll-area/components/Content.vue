<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ScrollAreaContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollAreaContext } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaContent',
})

const props = defineProps<ScrollAreaContentProps>()
const api = useScrollAreaContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getContentProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
