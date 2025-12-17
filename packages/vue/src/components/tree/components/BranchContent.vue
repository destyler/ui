<script lang="ts">

import type { PolymorphicProps } from '~/factory'

export interface TreeBranchContentProps extends PolymorphicProps {}

interface VisibilityProps {
  hidden?: boolean
  'data-state'?: string
}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { Collapsible } from '~/components/collapsible'
import { useTreeContext } from '../composables/use-tree-context'
import { useTreeNodePropsContext } from '../composables/use-tree-node-props-context'
import { createSplitProps } from '~/utils/create-split-props'
import { computed } from 'vue'

defineOptions({
  name: 'TreeBranchContent',
})

const splitVisibilityProps = createSplitProps<VisibilityProps>()

defineProps<TreeBranchContentProps>()
const treeView = useTreeContext()
const ndoeProps = useTreeNodePropsContext()

const branchContentProps = computed(() => {
  const contentProps = treeView.value.getBranchContentProps(ndoeProps)
  const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, ['hidden', 'data-state'])
  return ownProps
})

useForwardExpose()
</script>

<template>
  <Collapsible.Content v-bind="branchContentProps" :as-child="asChild">
    <slot />
  </Collapsible.Content>
</template>
