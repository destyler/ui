<script lang="ts">
import type { InputProps } from '@destyler/otp-input'
import type { PolymorphicProps } from '~/factory'

export interface OtpInputInputProps extends InputProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useOtpInputContext } from '../composables/use-otp-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputInput'
})

const props = defineProps<OtpInputInputProps>()
const otpInput = useOtpInputContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="otpInput.getInputProps(props)" :as-child="asChild">
    <slot />
  </ui.input>
</template>
