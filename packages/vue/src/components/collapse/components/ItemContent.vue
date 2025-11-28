<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CollapseItemContentProps extends PolymorphicProps {}

interface VisibilityProps {
  hidden?: boolean
  'data-state'?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Collapsible } from '~/components/collapsible'
import { useForwardExpose } from '~/composables'
import { createSplitProps } from '~/utils/create-split-props'
import { useCollapseContext } from '../composables/use-collapse-context'
import { useCollapseItemPropsContext } from '../composables/use-collapse-item-props-context'

const splitVisibilityProps = createSplitProps<VisibilityProps>()

const props = defineProps<CollapseItemContentProps>()
const collapse = useCollapseContext()
const itemProps = useCollapseItemPropsContext()

const itemContentProps = computed(() => {
  const contentProps = collapse.value.getItemContentProps(itemProps)
  const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, ['hidden', 'data-state'])
  return ownProps
})
useForwardExpose()
</script>

<template>
  <Collapsible.Content v-bind="itemContentProps" :as-child="props.asChild">
    <slot />
  </Collapsible.Content>
</template>
