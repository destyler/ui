<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseSignatureContext } from '../composables/use-signature-context'

export interface SignatureContextProps
  extends SlotsType<{
    default: UnwrapRef<UseSignatureContext>
  }> {}
</script>

<script setup lang="ts">
import { useSignatureContext } from '../composables/use-signature-context'

defineOptions({
  name: 'SignatureContext',
})

const signature = useSignatureContext()

defineSlots<{
  default(signature: UnwrapRef<UseSignatureContext>): unknown
}>()
</script>

<template>
  <slot v-bind="signature"></slot>
</template>
