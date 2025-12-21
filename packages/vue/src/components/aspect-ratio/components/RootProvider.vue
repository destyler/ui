<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseAspectRatioReturn } from '../composables/use-aspect-ratio'

interface RootProviderProps {
  value: UnwrapRef<UseAspectRatioReturn>
}

export interface AspectRatioRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { AspectRatioProvider } from '../composables/use-aspect-ratio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'AspectRatioRootProvider',
})

const props = defineProps<AspectRatioRootProviderProps>()
const aspectRatio = computed(() => props.value)

AspectRatioProvider(aspectRatio)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="aspectRatio.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
