<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicControl'
})

defineProps<DynamicControlProps>()
const dynamic = useDynamicContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dynamic.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
