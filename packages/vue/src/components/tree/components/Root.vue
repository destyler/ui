<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { TreeNode } from '~/utils/collection'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'
import type { RenderStrategyProps } from '~/composables'

export interface TreeRootProps<T extends TreeNode>
  extends RootProps<T>,
    RenderStrategyProps,
    PolymorphicProps {}
export type { RootEmits as TreeRootEmits } from '../types'
</script>

<script setup lang="ts" generic="T extends TreeNode">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTree } from '../composables/use-tree'
import { TreeProvider } from '../composables/use-tree-context'

defineOptions({
  name: 'TreeRoot',
})

const props = withDefaults(defineProps<TreeRootProps<T>>(), {
  expandOnClick: undefined,
  typeahead: undefined,
} satisfies BooleanDefaults<RootProps<T>>)

const emits = defineEmits<RootEmits>()

const treeView = useTree(props, emits)
TreeProvider(treeView)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
