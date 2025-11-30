<script lang="ts">
import { computed } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface CheckboxIndicatorProps extends PolymorphicProps {
  indeterminate?: boolean
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCheckboxContext } from '../composables/use-checkbox-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CheckboxIndicator'
})

const props = defineProps<CheckboxIndicatorProps>()
const checkbox = useCheckboxContext()
const isHidden = computed(() => (props.indeterminate ? checkbox.value.indeterminate : checkbox.value.checked))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="checkbox.getIndicatorProps()" :hidden="!isHidden" :as-child="asChild">
    <slot />
  </ui.div>
</template>
