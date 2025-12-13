<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface QrCodePatternProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useQrCodeContext } from '../composables/use-qr-code-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'QrCodePattern',
})

defineProps<QrCodePatternProps>()
const qrCode = useQrCodeContext()

useForwardExpose()
</script>

<template>
  <ui.path v-bind="qrCode.getPatternProps()" :as-child="asChild">
    <slot />
  </ui.path>
</template>
