<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseDynamicItemContext } from '../composables/use-dynamic-item-context'

export interface DynamicItemContextProps
  extends SlotsType<{
    default: UnwrapRef<UseDynamicItemContext>
  }> {}
</script>

<script setup lang="ts">
import { useDynamicItemContext } from '../composables/use-dynamic-item-context'

defineOptions({
  name: 'DynamicItemContext'
})

const dynamic = useDynamicItemContext()

defineSlots<{
  default(dynamic: UnwrapRef<UseDynamicItemContext>): unknown
}>()
</script>

<template>
  <slot v-bind="dynamic"></slot>
</template>
