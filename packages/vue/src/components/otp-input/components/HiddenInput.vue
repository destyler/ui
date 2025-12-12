<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface OtpInputHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useOtpInputContext } from '../composables/use-otp-input-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputHiddenInput'
})

defineProps<OtpInputHiddenInputProps>()

const otpInput = useOtpInputContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="otpInput.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
