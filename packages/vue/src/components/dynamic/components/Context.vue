<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseDynamicContext } from '../composables/use-dynamic-context'

export interface DynamicContextProps
  extends SlotsType<{
    default: UnwrapRef<UseDynamicContext>
  }> {}
</script>

<script setup lang="ts">
import { useDynamicContext } from '../composables/use-dynamic-context'

defineOptions({
  name: 'DynamicContext'
})

const dynamic = useDynamicContext()

defineSlots<{
  default(dynamic: UnwrapRef<UseDynamicContext>): unknown
}>()
</script>

<template>
  <slot v-bind="dynamic"></slot>
</template>
