<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface SliderRootProps extends RootProps, PolymorphicProps {}
export interface SliderRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSlider } from '../composables/use-slider'
import { SliderProvider } from '../composables/use-slider-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SliderRoot',
})

const props = withDefaults(defineProps<SliderRootProps>(), {
  disabled: undefined,
  invalid: undefined,
  readOnly: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<SliderRootEmits>()

const slider = useSlider(props, emits)

SliderProvider(slider)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="slider.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
