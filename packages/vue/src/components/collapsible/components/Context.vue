<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseCollapsibleContext } from '../composables/use-collapsible-context'

export interface CollapsibleContextProps
  extends SlotsType<{
    default: UnwrapRef<UseCollapsibleContext>
  }> {}
</script>

<script setup lang="ts">
import { useCollapsibleContext } from '../composables/use-collapsible-context'

defineOptions({
  name: 'CollapsibleContext'
})

const collapsible = useCollapsibleContext()

defineSlots<{
  default(collapsible: UnwrapRef<UseCollapsibleContext>): unknown
}>()
</script>

<template>
  <slot v-bind="collapsible"></slot>
</template>
