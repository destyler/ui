<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SignatureClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureClearTrigger',
})

defineProps<SignatureClearTriggerProps>()
const signature = useSignatureContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="signature.getClearTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
