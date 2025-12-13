<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseRadioItemContext } from '../composables/use-radio-item-context'

export interface RadioItemContextProps
  extends SlotsType<{
    default: UnwrapRef<UseRadioItemContext>
  }> {}
</script>

<script setup lang="ts">
import { useRadioItemContext } from '../composables/use-radio-item-context'

defineOptions({
  name: 'RadioItemContext'
})

const item = useRadioItemContext()

defineSlots<{
  default(item: UnwrapRef<UseRadioItemContext>): unknown
}>()
</script>

<template>
  <slot v-bind="item"></slot>
</template>
