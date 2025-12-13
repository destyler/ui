<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface RadioLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadioContext } from '../composables/use-radio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioLabel'
})

defineProps<RadioLabelProps>()
const radio = useRadioContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="radio.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
