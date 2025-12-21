<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseLabelContext } from '../composables/use-label-context'

export interface LabelContextProps
  extends SlotsType<{
    default: UnwrapRef<UseLabelContext>
  }> {}
</script>

<script setup lang="ts">
import { useLabelContext } from '../composables/use-label-context'

defineOptions({
  name: 'LabelContext',
})

const label = useLabelContext()

defineSlots<{
  default(label: UnwrapRef<UseLabelContext>): unknown
}>()
</script>

<template>
  <slot v-bind="label"></slot>
</template>
