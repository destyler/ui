<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeItemProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeItem',
})

defineProps<TreeItemProps>()
const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getItemProps(nodeProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
