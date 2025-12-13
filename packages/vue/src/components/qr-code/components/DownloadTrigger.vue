<script lang="ts">
import type { DownloadTriggerProps } from '@destyler/qr-code'
import type { PolymorphicProps } from '~/factory'

export interface QrCodeDownloadTriggerProps extends DownloadTriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useQrCodeContext } from '../composables/use-qr-code-context'

defineOptions({
  name: 'QrCodeDownloadTrigger',
})

const props = defineProps<QrCodeDownloadTriggerProps>()
const qrCode = useQrCodeContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="qrCode.getDownloadTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
