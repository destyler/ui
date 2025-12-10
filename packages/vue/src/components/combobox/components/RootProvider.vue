<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { CollectionItem } from '~/utils'
import type { PolymorphicProps } from '~/factory'
import type { UseComboboxReturn } from '../composables/use-combobox'

interface RootProviderProps<T extends CollectionItem> {
  value: UnwrapRef<UseComboboxReturn<T>>
}

export interface ComboboxRootProviderProps<T extends CollectionItem> extends RootProviderProps<T>,
    RenderStrategyProps,
    PolymorphicProps {}
</script>

<script setup lang="ts" generic="T extends CollectionItem">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { ComboboxProvider } from '../composables/use-combobox-context'

defineOptions({
  name: 'ComboboxRootProvider',
})

const props = defineProps<ComboboxRootProviderProps<T>>()
const combobox = computed(() => props.value)

ComboboxProvider(combobox)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
