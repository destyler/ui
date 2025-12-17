<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'

export interface TreeNodeContextProps
  extends SlotsType<{
    default: UnwrapRef<UseTreeNodeContext>
  }> {}
</script>

<script setup lang="ts">
import { useTreeNodeContext, type UseTreeNodeContext } from '../composables/use-tree-node-context'

defineOptions({
  name: 'TreeNodeContext',
})

const item = useTreeNodeContext()
defineSlots<{
  default(item: UnwrapRef<UseTreeNodeContext>): unknown
}>()
</script>

<template>
  <slot v-bind="item"></slot>
</template>
