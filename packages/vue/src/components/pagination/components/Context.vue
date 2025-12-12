<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UsePaginationContext } from '../composables/use-pagination-context'

export interface PaginationContextProps
  extends SlotsType<{
    default: UnwrapRef<UsePaginationContext>
  }> {}
</script>

<script setup lang="ts">
import { usePaginationContext } from '../composables/use-pagination-context'

defineOptions({
  name: 'PaginationContext',
})

const pagination = usePaginationContext()

defineSlots<{
  default(pagination: UnwrapRef<UsePaginationContext>): unknown
}>()
</script>

<template>
  <slot v-bind="pagination"></slot>
</template>
