<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface OtpInputLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useOtpInputContext } from '../composables/use-otp-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputLabel'
})

defineProps<OtpInputLabelProps>()
const otpInput = useOtpInputContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="otpInput.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
