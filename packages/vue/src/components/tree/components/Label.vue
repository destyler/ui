<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TreeLabel',
})

defineProps<TreeLabelProps>()
const treeView = useTreeContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="treeView.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
