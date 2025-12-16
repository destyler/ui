<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicItemInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useDynamicItemPropsContext } from '../composables/use-dynamic-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicItemInput'
})

defineProps<DynamicItemInputProps>()

const dynamic = useDynamicContext()
const itemProps = useDynamicItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="dynamic.getItemInputProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.input>
</template>
