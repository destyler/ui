<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface StepsCompletedContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsCompletedContent'
})

defineProps<StepsCompletedContentProps>()

const steps = useStepsContext()
const itemProps = computed(() => ({ index: steps.value.count }))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getContentProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
