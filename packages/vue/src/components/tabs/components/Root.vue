<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface TabsRootProps extends RootProps, RenderStrategyProps, PolymorphicProps {}
export interface TabsRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useTabs } from '../composables/use-tabs'
import { TabsProvider } from '../composables/use-tabs-context'

defineOptions({
  name: 'TabsRoot',
})

const props = withDefaults(defineProps<TabsRootProps>(), {
  composite: undefined,
  deselectable: undefined,
  loopFocus: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<TabsRootEmits>()

const tabs = useTabs(props, emits)

TabsProvider(tabs)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tabs.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
