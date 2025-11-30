<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'

export interface CollapseItemContextProps
  extends SlotsType<{
    default: UnwrapRef<UseCollapseItemContext>
  }> {}
</script>

<script setup lang="ts">
import { useCollapseItemContext, type UseCollapseItemContext } from '../composables/use-collapse-item-context'

defineOptions({
  name: 'CollapseItemContext'
})

const item = useCollapseItemContext()
defineSlots<{
  default(item: UnwrapRef<UseCollapseItemContext>): unknown
}>()
</script>

<template>
  <slot v-bind="item"></slot>
</template>
