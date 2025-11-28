<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface CollapseRootProps extends RootProps, RenderStrategyProps, PolymorphicProps {}
export interface CollapseRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useCollapse } from '../composables/use-collapse'
import { CollapseProvider } from '../composables/use-collapse-context'

const props = withDefaults(defineProps<CollapseRootProps>(), {
  collapsible: undefined,
  disabled: undefined,
  multiple: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<CollapseRootEmits>()

const collapse = useCollapse(props, emits)
CollapseProvider(collapse)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))
useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapse.getRootProps()" :as-child="props.asChild">
    <slot></slot>
  </ui.div>
</template>
