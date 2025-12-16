<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseDynamicReturn } from '../composables/use-dynamic'

interface RootProviderProps {
  value: UnwrapRef<UseDynamicReturn>
}

export interface DynamicRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { DynamicProvider } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicRootProvider'
})

const props = defineProps<DynamicRootProviderProps>()
const dynamic = computed(() => props.value)

DynamicProvider(dynamic)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dynamic.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
