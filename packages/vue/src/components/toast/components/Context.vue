<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseToastContext } from '../composables/use-toast-context'

export interface ToastContextProps
  extends SlotsType<{
    default: UnwrapRef<UseToastContext>
  }> {}
</script>

<script setup lang="ts">
import { useToastContext } from '../composables/use-toast-context'

defineOptions({
  name: 'ToastContext',
})

const toast = useToastContext()

defineSlots<{
  default(toast: UnwrapRef<UseToastContext>): unknown
}>()
</script>

<template>
  <slot v-bind="toast"></slot>
</template>
