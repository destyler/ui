<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSelectItemContext } from '../composables/use-select-item-context'

export interface SelectItemContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSelectItemContext>
  }> {}
</script>

<script setup lang="ts">
import { useSelectItemContext } from '../composables/use-select-item-context'

defineOptions({
  name: 'SelectItemContext'
})

const item = useSelectItemContext()

defineSlots<{
  default(item: UnwrapRef<UseSelectItemContext>): unknown
}>()
</script>

<template>
  <slot v-bind="item"></slot>
</template>
