<script lang="ts">
import type { ItemProps } from '@destyler/select'
import type { PolymorphicProps } from '~/factory'

export interface SelectItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useSelectPartProps } from '../composables/use-select-part-props'
import { SelectItemProvider } from '../composables/use-select-item-context'
import { SelectItemPropsProvider } from '../composables/use-select-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItem',
  inheritAttrs: false,
})

const props = defineProps<SelectItemProps>()
const select = useSelectContext()
const getMergedProps = useSelectPartProps(() => select.value.getItemProps(props))

SelectItemPropsProvider(props)
SelectItemProvider(computed(() => select.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="getMergedProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
