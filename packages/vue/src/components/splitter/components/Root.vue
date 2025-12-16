<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface SplitterRootProps extends RootProps, PolymorphicProps {}
export interface SplitterRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSplitter } from '../composables/use-splitter'
import { SplitterProvider } from '../composables/use-splitter-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SplitterRoot'
})

const props = defineProps<SplitterRootProps>()
const emits = defineEmits<SplitterRootEmits>()

const splitter = useSplitter(props, emits)
SplitterProvider(splitter)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="splitter.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
