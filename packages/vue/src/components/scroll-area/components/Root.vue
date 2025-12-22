<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ScrollAreaRootProps extends RootProps, PolymorphicProps {}
export interface ScrollAreaRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useScrollArea } from '../composables/use-scroll-area'
import { ScrollAreaProvider } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaRoot',
})

const props = defineProps<ScrollAreaRootProps>()
const emits = defineEmits<ScrollAreaRootEmits>()

const api = useScrollArea(props, emits)
ScrollAreaProvider(api)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="api.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
