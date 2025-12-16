<script lang="ts">
import type { ItemProps } from '@destyler/dynamic'
import type { PolymorphicProps } from '~/factory'

export interface DynamicItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { DynamicItemProvider } from '../composables/use-dynamic-item-context'
import { DynamicItemPropsProvider } from '../composables/use-dynamic-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicItem'
})

const props = defineProps<DynamicItemProps>()
const dynamic = useDynamicContext()

DynamicItemPropsProvider(props)
DynamicItemProvider(computed(() => dynamic.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dynamic.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
