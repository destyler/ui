<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuRadioItemGroupProps extends PolymorphicProps {
  id?: string
  modelValue?: string
}

export type MenuRadioItemGroupEmits = {
  'update:modelValue': [value: string]
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed, useId } from 'vue'
import { useMenuContext } from '../composables/use-menu-context'
import { MenuItemGroupProvider, type UseMenuItemGroupContext } from '../composables/use-menu-item-group-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuRadioItemGroup'
})

const props = defineProps<MenuRadioItemGroupProps>()
const emits = defineEmits<MenuRadioItemGroupEmits>()
const menu = useMenuContext()
const id = props.id ?? useId()

const itemGroupProps: UseMenuItemGroupContext = computed(() => ({
  id,
  value: props.modelValue,
  onValueChange: (e) => emits('update:modelValue', e.value),
}))

MenuItemGroupProvider(itemGroupProps)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemGroupProps(itemGroupProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
