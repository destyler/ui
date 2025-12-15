<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { CollectionItem } from '~/utils/collection'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface SelectRootProps<T extends CollectionItem>
  extends RootProps<T>,
    RenderStrategyProps,
    PolymorphicProps {}
export type { RootEmits as SelectRootEmits } from '../types'
</script>

<script setup lang="ts" generic="T extends CollectionItem">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useSelect } from '../composables/use-select'
import { SelectProvider } from '../composables/use-select-context'

defineOptions({
  name: 'SelectRoot'
})

const props = withDefaults(defineProps<SelectRootProps<T>>(), {
  closeOnSelect: undefined,
  composite: undefined,
  defaultOpen: undefined,
  deselectable: undefined,
  disabled: undefined,
  invalid: undefined,
  loopFocus: undefined,
  multiple: undefined,
  open: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps<T>>)

const emits = defineEmits<RootEmits<T>>()

const select = useSelect(props, emits)
SelectProvider(select)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
