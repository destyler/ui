<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseOtpInputReturn } from '../composables/use-otp-input'

interface RootProviderProps {
  value: UnwrapRef<UseOtpInputReturn>
}

export interface OtpInputRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { OtpInputProvider } from '../composables/use-otp-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'OtpInputRootProvider'
})

const props = defineProps<OtpInputRootProviderProps>()
const otpInput = computed(() => props.value)

OtpInputProvider(otpInput)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="otpInput.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
