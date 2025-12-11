<script lang="ts">
import type { OptionItemProps } from '@destyler/menu'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

type RadioItemProps = Omit<OptionItemProps, 'type' | 'onCheckedChange' | 'checked'>

export interface MenuRadioItemProps extends RadioItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed, type ComputedRef } from 'vue'
import { useMenuContext } from '../composables/use-menu-context'
import { MenuItemProvider } from '../composables/use-menu-item-context'
import { useMenuItemGroupContext } from '../composables/use-menu-item-group-context'
import { MenuOptionItemPropsProvider } from '../composables/use-menu-option-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuRadioItem'
})

const props = withDefaults(defineProps<MenuRadioItemProps>(), {
  disabled: undefined,
  closeOnSelect: undefined,
} satisfies BooleanDefaults<RadioItemProps>)

const menu = useMenuContext()
const itemGroup = useMenuItemGroupContext()

const optionItemProps: ComputedRef<OptionItemProps> = computed(() => ({
  ...props,
  checked: itemGroup.value.value === props.value,
  type: 'radio',
  onCheckedChange: () => itemGroup.value.onValueChange?.({ value: props.value }),
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
