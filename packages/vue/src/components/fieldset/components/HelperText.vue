<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldsetHelperTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldsetContext } from '../composables/use-fieldset-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldsetHelperText',
})

defineProps<FieldsetHelperTextProps>()
const fieldset = useFieldsetContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="fieldset.getHelperTextProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
