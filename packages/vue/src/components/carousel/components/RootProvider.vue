<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseCarouselReturn } from '../composables/use-carousel'

interface RootProviderProps {
  value: UnwrapRef<UseCarouselReturn>
}

export interface CarouselRootProviderProps extends RootProviderProps, PolymorphicProps{}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { CarouselProvider } from '../composables/use-carousel-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CarouselRootProvider'
})

const props = defineProps<CarouselRootProviderProps>()
const carousel = computed(() => props.value)

CarouselProvider(carousel)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="carousel.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
