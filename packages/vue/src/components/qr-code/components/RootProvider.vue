<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseQrCodeReturn } from '../composables/use-qr-code'

interface RootProviderProps {
  value: UnwrapRef<UseQrCodeReturn>
}

export interface QrCodeRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { QrCodeProvider } from '../composables/use-qr-code-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'QrCodeRootProvider',
})

const props = defineProps<QrCodeRootProviderProps>()
const qrCode = computed(() => props.value)

QrCodeProvider(qrCode)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="qrCode.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
