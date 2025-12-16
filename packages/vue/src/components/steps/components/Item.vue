<script lang="ts">
import type { ItemProps } from '@destyler/steps'
import type { PolymorphicProps } from '~/factory'

export interface StepsItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useStepsContext } from '../composables/use-steps-context'
import { StepsItemProvider } from '../composables/use-steps-item-context'
import { StepsItemPropsProvider } from '../composables/use-steps-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'StepsItem'
})

const props = defineProps<StepsItemProps>()
const steps = useStepsContext()
const itemState = computed(() => steps.value.getItemState(props))

StepsItemPropsProvider(props)
StepsItemProvider(itemState)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="steps.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
