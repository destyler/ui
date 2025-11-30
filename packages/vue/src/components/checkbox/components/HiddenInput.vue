<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CheckboxHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCheckboxContext } from '../composables/use-checkbox-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineProps<CheckboxHiddenInputProps>()
const checkbox = useCheckboxContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="checkbox.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
