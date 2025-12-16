<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseSliderReturn } from '../composables/use-slider'

interface RootProviderProps {
  value: UnwrapRef<UseSliderReturn>
}

export interface SliderRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { SliderProvider } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderRootProvider',
})

const props = defineProps<SliderRootProviderProps>()
const slider = computed(() => props.value)

SliderProvider(slider)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="slider.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
