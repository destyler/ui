<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuItemIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useMenuOptionItemPropsContext } from '../composables/use-menu-option-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuItemIndicator'
})

defineProps<MenuItemIndicatorProps>()

const menu = useMenuContext()
const optionItemProps = useMenuOptionItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getItemIndicatorProps(optionItemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>
