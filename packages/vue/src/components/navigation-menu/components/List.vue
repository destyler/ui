<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuListProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuList',
})

defineProps<NavigationMenuListProps>()
const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.ul v-bind="navigationMenu.getListProps()" :as-child="asChild">
    <slot />
  </ui.ul>
</template>
