<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SignatureControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureControl',
})

defineProps<SignatureControlProps>()
const signature = useSignatureContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="signature.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
