<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseStepsReturn } from '../composables/use-steps'

interface RootProviderProps {
  value: UnwrapRef<UseStepsReturn>
}

export interface StepsRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { StepsProvider } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsRootProvider'
})

const props = defineProps<StepsRootProviderProps>()
const steps = computed(() => props.value)

StepsProvider(steps)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
