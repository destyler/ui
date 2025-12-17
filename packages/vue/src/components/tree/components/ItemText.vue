<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TreeItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'

defineOptions({
  name: 'TreeItemText',
})

defineProps<TreeItemTextProps>()

const treeView = useTreeContext()
const nodeProps = useTreeNodePropsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="treeView.getItemTextProps(nodeProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
