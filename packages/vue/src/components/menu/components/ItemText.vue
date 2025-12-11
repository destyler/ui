<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import { useMenuOptionItemPropsContext } from '../composables/use-menu-option-item-props-context'

export interface MenuItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuItemText'
})

defineProps<MenuItemTextProps>()

const menu = useMenuContext()
const optionItemProps = useMenuOptionItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemTextProps(optionItemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
