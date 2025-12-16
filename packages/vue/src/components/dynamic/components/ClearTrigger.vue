<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicClearTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicClearTrigger'
})

defineProps<DynamicClearTriggerProps>()
const dynamic = useDynamicContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="dynamic.getClearTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
