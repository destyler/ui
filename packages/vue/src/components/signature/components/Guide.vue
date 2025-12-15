<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SignatureGuideProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineProps<SignatureGuideProps>()
const signature = useSignatureContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="signature.getGuideProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
