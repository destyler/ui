<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseLabelReturn } from '../composables/use-label'

interface RootProviderProps {
  value: UnwrapRef<UseLabelReturn>
}

export interface LabelRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { LabelProvider } from '../composables/use-label-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'LabelRootProvider',
})

const props = defineProps<LabelRootProviderProps>()
const label = computed(() => props.value)

LabelProvider(label)
useForwardExpose()
</script>

<template>
  <ui.label v-bind="label.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.label>
</template>
