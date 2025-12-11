<script lang="ts">
import type { ItemGroupProps } from '@destyler/menu'
import type { PolymorphicProps } from '~/factory'

export interface MenuItemGroupProps extends Partial<ItemGroupProps>, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { MenuItemGroupProvider } from '../composables/use-menu-item-group-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuItemGroup'
})

const props = defineProps<MenuItemGroupProps>()

const menu = useMenuContext()
const id = props.id ?? useId()
const itemGroupProps = computed(() => ({ id }))

MenuItemGroupProvider(itemGroupProps)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemGroupProps(itemGroupProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
