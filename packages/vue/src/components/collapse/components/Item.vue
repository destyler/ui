<script lang="ts">
import type { ItemProps } from '@destyler/collapse'
import type { PolymorphicProps } from '~/factory'

export interface CollapseItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import * as Collapsible from '~/components/collapsible/namespace'
import { useCollapseContext } from '../composables/use-collapse-context'
import { CollapseItemProvider } from '../composables/use-collapse-item-context'
import { CollapseItemPropsProvider } from '../composables/use-collapse-item-props-context'

defineOptions({
  name: 'CollapseItem'
})

const collapse = useCollapseContext()
const props = defineProps<CollapseItemProps>()
const item = computed(() => collapse.value.getItemState(props))
const renderStrategyProps = useRenderStrategyProps()
const itemContentProps = computed(() => collapse.value.getItemContentProps(props))

CollapseItemProvider(item)
CollapseItemPropsProvider(props)

useForwardExpose()
</script>

<template>
  <Collapsible.Root
    v-bind="collapse.getItemProps(props)"
    :open="item.expanded"
    :lazy-mount="renderStrategyProps.lazyMount"
    :unmount-on-exit="renderStrategyProps.unmountOnExit"
    :ids="{ content: itemContentProps.id }"
  >
    <slot />
  </Collapsible.Root>
</template>
