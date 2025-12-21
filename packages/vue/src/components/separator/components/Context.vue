<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSeparatorContext } from '../composables/use-separator-context'

export interface SeparatorContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSeparatorContext>
  }> {}
</script>

<script setup lang="ts">
import { useSeparatorContext } from '../composables/use-separator-context'

defineOptions({
  name: 'SeparatorContext',
})

const separator = useSeparatorContext()

defineSlots<{
  default(separator: UnwrapRef<UseSeparatorContext>): unknown
}>()
</script>

<template>
  <slot v-bind="separator"></slot>
</template>
