<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicInput'
})

defineProps<DynamicInputProps>()
const dynamic = useDynamicContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="dynamic.getInputProps()" :as-child="asChild"><slot /></ui.input>
</template>
