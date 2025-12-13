<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface QrCodeRootProps extends RootProps, PolymorphicProps {}
export interface QrCodeRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useQrCode } from '../composables/use-qr-code'
import { QrCodeProvider } from '../composables/use-qr-code-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'QrCodeRoot',
})

const props = defineProps<QrCodeRootProps>()
const qrCode = useQrCode(props)

QrCodeProvider(qrCode)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="qrCode.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
