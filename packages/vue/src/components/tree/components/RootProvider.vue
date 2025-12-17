<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { TreeNode } from '~/utils/collection'
import type { PolymorphicProps } from '~/factory'
import type { UseTreeReturn } from '../composables/use-tree'

interface RootProviderProps<T extends TreeNode> {
  value: UnwrapRef<UseTreeReturn<T>>
}

export interface TreeRootProviderProps<T extends TreeNode>
  extends RootProviderProps<T>,
    RenderStrategyProps,
    PolymorphicProps {}
</script>

<script setup lang="ts" generic="T extends TreeNode">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { TreeProvider } from '../composables/use-tree-context'

defineOptions({
  name: 'TreeRootProvider',
})

const props = defineProps<TreeRootProviderProps<T>>()
const treeView = computed(() => props.value)

TreeProvider(treeView)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="treeView.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
