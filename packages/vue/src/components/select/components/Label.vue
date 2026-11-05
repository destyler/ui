<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectPartProps } from '../composables/use-select-part-props'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectLabel',
  inheritAttrs: false,
})

defineProps<SelectLabelProps>()
const select = useSelectContext()
const getMergedProps = useSelectPartProps(() => select.value.getLabelProps())

useForwardExpose()
</script>

<template>
  <ui.label v-bind="getMergedProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
