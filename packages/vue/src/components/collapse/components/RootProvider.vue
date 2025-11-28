<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { UseCollapseReturn } from '../composables/use-collapse'

interface RootProviderProps {
  value: UnwrapRef<UseCollapseReturn>
}

export interface CollapseRootProviderProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { CollapseProvider } from '../composables/use-collapse-context'

const props = defineProps<CollapseRootProviderProps>()
const collapse = computed(() => props.value)

CollapseProvider(collapse)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))
useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapse.getRootProps()" :as-child="props.asChild">
    <slot></slot>
  </ui.div>
</template>
