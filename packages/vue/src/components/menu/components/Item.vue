<script lang="ts">
import type { ItemProps } from '@destyler/menu'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

export interface MenuItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useMenuContext } from '../composables/use-menu-context'
import { MenuItemProvider } from '../composables/use-menu-item-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuItem'
})

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: undefined,
  closeOnSelect: undefined,
} satisfies BooleanDefaults<ItemProps>)

const menu = useMenuContext()

MenuItemProvider(computed(() => menu.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
