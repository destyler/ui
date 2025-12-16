<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSwitchContext } from '../composables/use-switch-context'

export interface SwitchContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSwitchContext>
  }> {}
</script>

<script setup lang="ts">
import { useSwitchContext } from '../composables/use-switch-context'

defineOptions({
  name: 'SwitchContext',
})

const context = useSwitchContext()

defineSlots<{
  default(context: UnwrapRef<UseSwitchContext>): unknown
}>()
</script>

<template>
  <slot v-bind="context" />
</template>
