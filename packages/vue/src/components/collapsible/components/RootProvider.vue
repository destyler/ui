<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseCollapsibleReturn } from '../composables/use-collapsible'

interface RootProviderProps {
  value: UnwrapRef<UseCollapsibleReturn>
}

export interface CollapsibleRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { CollapsibleProvider } from '../composables/use-collapsible-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<CollapsibleRootProviderProps>()
const collapsible = computed(() => props.value)

CollapsibleProvider(collapsible)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapsible.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
