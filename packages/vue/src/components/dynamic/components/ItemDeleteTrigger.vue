<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicItemDeleteTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useDynamicItemPropsContext } from '../composables/use-dynamic-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicItemDeleteTrigger'
})

defineProps<DynamicItemDeleteTriggerProps>()
const dynamic = useDynamicContext()
const itemProps = useDynamicItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="dynamic.getItemDeleteTriggerProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
