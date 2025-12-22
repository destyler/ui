<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootProviderProps } from '../types'

export interface ScrollAreaRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { ScrollAreaProvider } from '../composables/use-scroll-area-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ScrollAreaRootProvider',
})

const props = defineProps<ScrollAreaRootProviderProps>()
const scrollArea = computed(() => props.value)

ScrollAreaProvider(scrollArea)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="scrollArea.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
