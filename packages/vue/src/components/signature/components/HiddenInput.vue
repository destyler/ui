<script lang="ts">
import type { HiddenInputProps } from '@destyler/signature'
import type { PolymorphicProps } from '~/factory'

export interface SignatureHiddenInputProps extends HiddenInputProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSignatureContext } from '../composables/use-signature-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

const props = defineProps<SignatureHiddenInputProps>()
const signature = useSignatureContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input
    :aria-describedby="field?.ariaDescribedby"
    v-bind="signature.getHiddenInputProps(props)"
    :as-child="asChild"
  >
    <slot />
  </ui.input>
</template>
