<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface SignatureRootProps extends RootProps, PolymorphicProps {}
export interface SignatureRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignature } from '../composables/use-signature'
import { SignatureProvider } from '../composables/use-signature-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SignatureRoot',
})

const props = withDefaults(defineProps<SignatureRootProps>(), {
  readOnly: undefined,
  disabled: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<SignatureRootEmits>()

const signature = useSignature(props, emits)
SignatureProvider(signature)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="signature.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
