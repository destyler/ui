<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectPartProps } from '../composables/use-select-part-props'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectClearTrigger',
  inheritAttrs: false,
})

defineProps<SelectClearTriggerProps>()
const select = useSelectContext()
const getMergedProps = useSelectPartProps(() => select.value.getClearTriggerProps())

useForwardExpose()
</script>

<template>
  <ui.button v-bind="getMergedProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
