<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseProgressReturn } from '../composables/use-progress'

interface RootProviderProps {
  value: UnwrapRef<UseProgressReturn>
}

export interface ProgressRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { ProgressProvider } from '../composables/use-progress-context'

defineOptions({
  name: 'ProgressRootProvider',
})

const props = defineProps<ProgressRootProviderProps>()
const progress = computed(() => props.value)

ProgressProvider(progress)
</script>

<template>
  <ui.div v-bind="progress.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
