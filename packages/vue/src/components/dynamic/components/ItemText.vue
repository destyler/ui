<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useDynamicItemPropsContext } from '../composables/use-dynamic-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicItemText'
})

defineProps<DynamicItemTextProps>()

const dynamic = useDynamicContext()
const itemProps = useDynamicItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="dynamic.getItemTextProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>
