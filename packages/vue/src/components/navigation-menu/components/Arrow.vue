<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuArrow',
})

defineProps<NavigationMenuArrowProps>()
const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="navigationMenu.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
