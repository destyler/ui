<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SignatureLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureLabel',
})

defineProps<SignatureLabelProps>()
const signature = useSignatureContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="signature.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
