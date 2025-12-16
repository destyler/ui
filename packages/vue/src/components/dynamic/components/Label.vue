<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicLabel'
})

defineProps<DynamicLabelProps>()
const dynamic = useDynamicContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="dynamic.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
