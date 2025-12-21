<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface AspectRatioRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useAspectRatio } from '../composables/use-aspect-ratio'
import { AspectRatioProvider } from '../composables/use-aspect-ratio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'AspectRatioRoot',
})

const props = defineProps<AspectRatioRootProps>()

const aspectRatio = useAspectRatio(props)
AspectRatioProvider(aspectRatio)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="aspectRatio.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
