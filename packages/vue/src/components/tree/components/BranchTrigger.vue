<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeBranchTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeBranchTrigger',
})

defineProps<TreeBranchTriggerProps>()

const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getBranchTriggerProps(nodeProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
