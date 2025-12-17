<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'
import { tourAnatomy } from '../anatomy'

defineOptions({
  name: 'TourControl'
})

defineProps<TourControlProps>()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="{ ...tourAnatomy.build().control.attrs }" :as-child="asChild">
    <slot />
  </ui.div>
</template>
