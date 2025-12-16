<script lang="ts">
import type { ContentProps } from '@destyler/tabs'
import type { PolymorphicProps } from '~/factory'

export interface TabContentProps extends ContentProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { useRenderStrategyProps } from '~/composables'
import { useTabsContext } from '../composables/use-tabs-context'
import { Presence } from '~/components/presence'

defineOptions({
  name: 'TabContent',
})

const props = defineProps<TabContentProps>()
const tabs = useTabsContext()
const renderStrategy = useRenderStrategyProps()

useForwardExpose()
</script>

<template>
  <Presence
    v-bind="tabs.getContentProps(props)"
    :present="tabs.value === props.value"
    :lazy-mount="renderStrategy.lazyMount"
    :unmount-on-exit="renderStrategy.unmountOnExit"
    :immediate="true"
  >
    <slot />
  </Presence>
</template>
