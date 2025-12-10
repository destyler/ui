<script lang="ts">
import type { ItemProps } from '@destyler/combobox'
import type { PolymorphicProps } from '~/factory'

export interface ComboboxItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useComboboxContext } from '../composables/use-combobox-context'
import { ComboboxItemProvider } from '../composables/use-combobox-item-context'
import { ComboboxItemPropsProvider } from '../composables/use-combobox-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ComboboxItem',
})

const props = defineProps<ComboboxItemProps>()
const combobox = useComboboxContext()
ComboboxItemPropsProvider(props)
ComboboxItemProvider(computed(() => combobox.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="combobox.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
