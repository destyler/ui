<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseCollapseContext } from '../composables/use-collapse-context'

export interface CollapseContextProps
  extends SlotsType<{
    default: UnwrapRef<UseCollapseContext>
  }> {}
</script>

<script setup lang="ts">
import { useCollapseContext } from '../composables/use-collapse-context'

defineOptions({
  name: 'CollapseContext'
})

const collapse = useCollapseContext()

defineSlots<{
  default(collapse: UnwrapRef<UseCollapseContext>): unknown
}>()
</script>

<template>
  <slot v-bind="collapse"></slot>
</template>
