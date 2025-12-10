<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxInput',
})

defineProps<ComboboxInputProps>()
const combobox = useComboboxContext()
const field = useFieldContext()
useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="combobox.getInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
