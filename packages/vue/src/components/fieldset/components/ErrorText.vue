<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface FieldsetErrorTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useFieldsetContext } from '../composables/use-fieldset-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldsetErrorText',
})

defineProps<FieldsetErrorTextProps>()
const fieldset = useFieldsetContext()

useForwardExpose()
</script>

<template>
  <ui.span v-if="fieldset.invalid" v-bind="fieldset.getErrorTextProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>
