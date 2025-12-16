<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSplitterContext } from '../composables/use-splitter-context'

export interface SplitterContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSplitterContext>
  }> {}
</script>

<script setup lang="ts">
import { useSplitterContext } from '../composables/use-splitter-context'

defineOptions({
  name: 'SplitterContext'
})

const splitter = useSplitterContext()

defineSlots<{
  default(splitter: UnwrapRef<UseSplitterContext>): unknown
}>()
</script>

<template>
  <slot v-bind="splitter"></slot>
</template>
