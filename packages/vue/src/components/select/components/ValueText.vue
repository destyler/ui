<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectValueTextProps extends PolymorphicProps {
  placeholder?: string
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectValueText'
})

const props = defineProps<SelectValueTextProps>()
const select = useSelectContext()
const slots = defineSlots()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="select.getValueTextProps()" :as-child="asChild">
    <slot>{{ slots.default?.() || select.valueAsString || props.placeholder }}</slot>
  </ui.span>
</template>
