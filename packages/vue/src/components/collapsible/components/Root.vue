<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface CollapsibleRootProps extends RootProps, PolymorphicProps {}
export interface CollapsibleRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCollapsible } from '../composables/use-collapsible'
import { CollapsibleProvider } from '../composables/use-collapsible-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CollapsibleRoot'
})

const props = withDefaults(defineProps<CollapsibleRootProps>(), {
  defaultOpen: undefined,
  disabled: undefined,
  lazyMount: undefined,
  open: undefined,
  unmountOnExit: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<CollapsibleRootEmits>()

const collapsible = useCollapsible(props, emits)
CollapsibleProvider(collapsible)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="collapsible.getRootProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
