<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeTreeProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TreeTree',
})

defineProps<TreeTreeProps>()
const treeView = useTreeContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getTreeProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
