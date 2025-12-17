<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToggleIndicatorProps extends PolymorphicProps {}
</script>


<script setup lang="ts">
import { computed } from 'vue'
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useToggleContext } from '../composables/use-toggle-context'

defineOptions({
  name: 'ToggleIndicator',
})

defineProps<ToggleIndicatorProps>()
const toggle = useToggleContext()

const fallback = computed(() => !toggle.value.pressed)

useForwardExpose()
</script>

<template>
  <ui.span v-bind="toggle.getIndicatorProps()" :as-child="asChild">
    <slot v-if="!fallback" />
    <slot v-else name="fallback" />
  </ui.span>
</template>
