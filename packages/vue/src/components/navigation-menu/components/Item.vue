<script lang="ts">
import type { ItemProps } from '@destyler/navigation-menu'
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuItem',
})

const props = defineProps<NavigationMenuItemProps>()
const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.li v-bind="navigationMenu.getItemProps({ value: props.value })" :as-child="asChild">
    <slot />
  </ui.li>
</template>
