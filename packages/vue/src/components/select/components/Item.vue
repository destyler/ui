<script lang="ts">
import type { ItemProps } from '@destyler/select'
import type { PolymorphicProps } from '~/factory'

export interface SelectItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { SelectItemProvider } from '../composables/use-select-item-context'
import { SelectItemPropsProvider } from '../composables/use-select-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SelectItem'
})

const props = defineProps<SelectItemProps>()
const select = useSelectContext()

SelectItemPropsProvider(props)
SelectItemProvider(computed(() => select.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="select.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
