<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseNavigationMenuContext } from '../composables/use-navigation-menu-context'

export interface NavigationMenuContextProps
  extends SlotsType<{
    default: UnwrapRef<UseNavigationMenuContext>
  }> {}
</script>

<script setup lang="ts">
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'

defineOptions({
  name: 'NavigationMenuContext',
})

const navigationMenu = useNavigationMenuContext()

defineSlots<{
  default(navigationMenu: UnwrapRef<UseNavigationMenuContext>): unknown
}>()
</script>

<template>
  <slot v-bind="navigationMenu"></slot>
</template>
