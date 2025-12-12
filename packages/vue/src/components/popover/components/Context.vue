<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UsePopoverContext } from '../composables/use-popover-context'

export interface PopoverContextProps
  extends SlotsType<{
    default: UnwrapRef<UsePopoverContext>
  }> {}
</script>

<script setup lang="ts">
import { usePopoverContext } from '../composables/use-popover-context'

defineOptions({
  name: 'PopoverContext'
})

const popover = usePopoverContext()

defineSlots<{
  default(popover: UnwrapRef<UsePopoverContext>): unknown
}>()
</script>

<template>
  <slot v-bind="popover"></slot>
</template>
