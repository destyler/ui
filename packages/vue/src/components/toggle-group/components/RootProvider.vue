<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseToggleGroupReturn } from '../composables/use-toggle-group'

interface RootProviderProps {
  value: UnwrapRef<UseToggleGroupReturn>
}

export interface ToggleGroupRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { ToggleGroupProvider } from '../composables/use-toggle-group-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToggleGroupRootProvider'
})

const props = defineProps<ToggleGroupRootProviderProps>()
const toggleGroup = computed(() => props.value)

ToggleGroupProvider(toggleGroup)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="toggleGroup.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
