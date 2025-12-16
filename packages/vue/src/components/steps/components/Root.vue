<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface StepsRootProps extends RootProps, PolymorphicProps {}
export interface StepsRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSteps } from '../composables/use-steps'
import { StepsProvider } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsRoot'
})

const props = withDefaults(defineProps<StepsRootProps>(), {
  linear: undefined,
} satisfies BooleanDefaults<RootProps>)

const steps = useSteps(props)

StepsProvider(steps)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
