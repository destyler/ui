<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseSeparatorReturn } from '../composables/use-separator'
import type { RootProps } from '../types'

interface RootProviderProps {
  value: UnwrapRef<UseSeparatorReturn>
}

export interface SeparatorRootProviderProps extends RootProviderProps, RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { SeparatorProvider } from '../composables/use-separator-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SeparatorRootProvider',
})

const props = defineProps<SeparatorRootProviderProps>()
const separator = computed(() => props.value)

SeparatorProvider(separator)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="separator.getRootProps(props.orientation)" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>
