<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface LabelRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useLabel } from '../composables/use-label'
import { LabelProvider } from '../composables/use-label-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'LabelRoot',
})

const props = defineProps<LabelRootProps>()

const label = useLabel(props)
LabelProvider(label)

useForwardExpose()
</script>

<template>
  <ui.label v-bind="label.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.label>
</template>
