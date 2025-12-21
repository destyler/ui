<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { UseFloatingPanelReturn } from '../composables/use-floating-panel'

interface RootProviderProps {
  value: UnwrapRef<UseFloatingPanelReturn>
}

export interface FloatingPanelRootProviderProps extends RootProviderProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardExpose } from '~/composables'
import { FloatingPanelProvider } from '../composables/use-floating-panel-context'

defineOptions({
  name: 'FloatingPanelRootProvider',
})

const props = defineProps<FloatingPanelRootProviderProps>()
const floatingPanel = computed(() => props.value)

FloatingPanelProvider(floatingPanel)

useForwardExpose()
</script>

<template>
  <slot />
</template>
