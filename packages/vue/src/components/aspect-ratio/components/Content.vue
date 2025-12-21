<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface AspectRatioContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useAspectRatioContext } from '../composables/use-aspect-ratio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'AspectRatioContent',
})

const props = defineProps<AspectRatioContentProps>()
const aspectRatio = useAspectRatioContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="aspectRatio.getContentProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
