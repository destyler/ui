<script lang="ts">
import type { OptionItemProps } from '@destyler/menu'
import type { ComputedRef } from 'vue'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

type CheckboxItemProps = Omit<OptionItemProps, 'type' | 'onCheckedChange'>

export interface MenuCheckboxItemProps extends CheckboxItemProps, PolymorphicProps {}

export type MenuCheckboxItemEmits = {
  'update:checked': [value: boolean]
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useMenuContext } from '../composables/use-menu-context'
import { MenuItemProvider } from '../composables/use-menu-item-context'
import { MenuOptionItemPropsProvider } from '../composables/use-menu-option-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuCheckboxItem'
})

const props = withDefaults(defineProps<MenuCheckboxItemProps>(), {
  checked: undefined,
  disabled: undefined,
  closeOnSelect: undefined,
} satisfies BooleanDefaults<CheckboxItemProps>)

const emits = defineEmits<MenuCheckboxItemEmits>()

const menu = useMenuContext()
const optionItemProps: ComputedRef<OptionItemProps> = computed(() => ({
  ...props,
  type: 'checkbox',
  onCheckedChange: (e) => emits('update:checked', e),
}))

const optionItemState = computed(() => menu.value.getOptionItemState(optionItemProps.value))

MenuItemProvider(optionItemState)
MenuOptionItemPropsProvider(optionItemProps)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getOptionItemProps(optionItemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
