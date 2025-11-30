<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CheckboxControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCheckboxContext } from '../composables/use-checkbox-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CheckboxControl'
})

defineProps<CheckboxControlProps>()
const checkbox = useCheckboxContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="checkbox.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
