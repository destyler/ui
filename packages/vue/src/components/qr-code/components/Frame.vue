<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface QrCodeFrameProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useQrCodeContext } from '../composables/use-qr-code-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'QrCodeFrame',
})

defineProps<QrCodeFrameProps>()
const qrCode = useQrCodeContext()

useForwardExpose()
</script>

<template>
  <ui.svg v-bind="qrCode.getFrameProps()" :as-child="asChild">
    <slot />
  </ui.svg>
</template>
