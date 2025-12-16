<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicItemPreviewProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useDynamicItemPropsContext } from '../composables/use-dynamic-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicItemPreview'
})

defineProps<DynamicItemPreviewProps>()

const dynamic = useDynamicContext()
const itemProps = useDynamicItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dynamic.getItemPreviewProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
