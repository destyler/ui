<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseEditContext } from '../composables/use-edit-context'

export interface EditContextProps
  extends SlotsType<{
    default: UnwrapRef<UseEditContext>
  }> {}
</script>

<script setup lang="ts">
import { useEditContext } from '../composables/use-edit-context'

defineOptions({
  name: 'EditContext',
})

const edit = useEditContext()

defineSlots<{
  default(edit: UnwrapRef<UseEditContext>): unknown
}>()
</script>

<template>
  <slot v-bind="edit"></slot>
</template>
