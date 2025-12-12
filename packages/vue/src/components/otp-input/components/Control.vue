<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface OtpInputControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useOtpInputContext } from '../composables/use-otp-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputControl'
})

defineProps<OtpInputControlProps>()
const otpInput = useOtpInputContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="otpInput.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
