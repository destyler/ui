<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuItemGroupLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useMenuItemGroupContext } from '../composables/use-menu-item-group-context'
import { useForwardExpose } from '~/composables'

defineProps<MenuItemGroupLabelProps>()

const menu = useMenuContext()
const itemGroup = useMenuItemGroupContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemGroupLabelProps({ htmlFor: itemGroup.id })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
