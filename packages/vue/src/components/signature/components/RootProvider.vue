<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseSignatureReturn } from '../composables/use-signature'

interface RootProviderProps {
  value: UnwrapRef<UseSignatureReturn>
}

export interface SignatureRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { SignatureProvider } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureRootProvider',
})

const props = defineProps<SignatureRootProviderProps>()
const signature = computed(() => props.value)

SignatureProvider(signature)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="signature.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
