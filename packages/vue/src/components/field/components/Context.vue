<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseFieldContext } from '../composables/use-field-context'

export interface FieldContextProps
  extends SlotsType<{
    default: UnwrapRef<UseFieldContext>
  }> {}
</script>

<script setup lang="ts">
import { useFieldContext } from '../composables/use-field-context'

defineOptions({
  name: 'FieldContext'
})

const field = useFieldContext()

defineSlots<{
  default(field: UnwrapRef<UseFieldContext>): unknown
}>()
</script>

<template>
  <slot v-bind="field"></slot>
</template>
