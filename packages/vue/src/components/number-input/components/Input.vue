<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NumberInputInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNumberInputContext } from '../composables/use-number-input-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputInput',
})

defineProps<NumberInputInputProps>()
const numberInput = useNumberInputContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="numberInput.getInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
