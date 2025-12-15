<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SignatureSegmentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureSegment',
})

defineProps<SignatureSegmentProps>()
const signature = useSignatureContext()

useForwardExpose()
</script>

<template>
  <ui.svg v-bind="signature.getSegmentProps()" :as-child="asChild">
    <title>Signature</title>
    <path v-for="(path, i) in signature.paths" :key="i" v-bind="signature.getSegmentPathProps({ path })" />
    <path
      v-if="signature.currentPath"
      v-bind="signature.getSegmentPathProps({ path: signature.currentPath })"
    />
  </ui.svg>
</template>
