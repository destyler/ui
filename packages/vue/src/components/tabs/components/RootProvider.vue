<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { UseTabsReturn } from '../composables/use-tabs'

interface RootProviderProps {
  value: UnwrapRef<UseTabsReturn>
}

export interface TabsRootProviderProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { TabsProvider } from '../composables/use-tabs-context'

defineOptions({
  name: 'TabsRootProvider',
})

const props = defineProps<TabsRootProviderProps>()
const tabs = computed(() => props.value)

TabsProvider(tabs)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tabs.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
