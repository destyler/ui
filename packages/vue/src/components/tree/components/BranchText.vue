<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeBranchTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeBranchText',
})

defineProps<TreeBranchTextProps>()

const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="treeView.getBranchTextProps(nodeProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
