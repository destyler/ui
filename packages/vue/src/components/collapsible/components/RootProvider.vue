<script lang="ts">
import type { HTMLAttributes, UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseCollapsibleReturn } from '../composables/use-collapsible'

interface RootProviderProps {
  value: UnwrapRef<UseCollapsibleReturn>
}

export interface CollapsibleRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface CollapsibleRootProviderProps
  extends /* @vue-ignore */ CollapsibleRootProviderBaseProps,
    /* @vue-ignore */ HTMLAttributes {}
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
  <ui.div v-bind="collapsible.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
