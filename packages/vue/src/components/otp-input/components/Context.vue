<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseOtpInputContext } from '../composables/use-otp-input-context'

export interface OtpInputContextProps
  extends SlotsType<{
    default: UnwrapRef<UseOtpInputContext>
  }> {}
</script>

<script setup lang="ts">
import { useOtpInputContext } from '../composables/use-otp-input-context'

defineOptions({
  name: 'OtpInputContext'
})

const otpInput = useOtpInputContext()

defineSlots<{
  default(otpInput: UnwrapRef<UseOtpInputContext>): unknown
}>()
</script>

<template>
  <slot v-bind="otpInput"></slot>
</template>
