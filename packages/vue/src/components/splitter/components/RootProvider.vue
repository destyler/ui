<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseSplitterReturn } from '../composables/use-splitter'

interface RootProviderProps {
  value: UnwrapRef<UseSplitterReturn>
}

export interface SplitterRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { SplitterProvider } from '../composables/use-splitter-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SplitterRootProvider'
})

const props = defineProps<SplitterRootProviderProps>()

const splitter = computed(() => props.value)
SplitterProvider(splitter)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="splitter.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
