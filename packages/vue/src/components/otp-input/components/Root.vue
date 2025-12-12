<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface OtpInputRootProps extends RootProps, PolymorphicProps {}
export interface OtpInputRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useOtpInput } from '../composables/use-otp-input'
import { OtpInputProvider } from '../composables/use-otp-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputRoot'
})

const props = withDefaults(defineProps<OtpInputRootProps>(), {
  autoFocus: undefined,
  blurOnComplete: undefined,
  disabled: undefined,
  invalid: undefined,
  mask: undefined,
  otp: undefined,
  readOnly: undefined,
  required: undefined,
  selectOnFocus: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<OtpInputRootEmits>()

const otpInput = useOtpInput(props, emits)

OtpInputProvider(otpInput)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="otpInput.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
