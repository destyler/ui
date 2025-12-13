<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface QrCodeOverlayProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useQrCodeContext } from '../composables/use-qr-code-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'QrCodeOverlay',
})

defineProps<QrCodeOverlayProps>()
const qrCode = useQrCodeContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="qrCode.getOverlayProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
