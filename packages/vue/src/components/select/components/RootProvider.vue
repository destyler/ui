<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { CollectionItem } from '~/utils/collection'
import type { PolymorphicProps } from '~/factory'
import type { UseSelectReturn } from '../composables/use-select'

interface RootProviderProps<T extends CollectionItem> {
  value: UnwrapRef<UseSelectReturn<T>>
}

export interface SelectRootProviderProps<T extends CollectionItem>
  extends RootProviderProps<T>,
    RenderStrategyProps,
    PolymorphicProps {}
</script>

<script setup lang="ts" generic="T extends CollectionItem">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { SelectProvider } from '../composables/use-select-context'

defineOptions({
  name: 'SelectRootProvider'
})

const props = defineProps<SelectRootProviderProps<T>>()
const select = computed(() => props.value)

SelectProvider(select)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
