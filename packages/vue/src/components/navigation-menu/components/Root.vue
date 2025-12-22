<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface NavigationMenuRootProps extends RootProps, PolymorphicProps {}
export interface NavigationMenuRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'
import { useNavigationMenu } from '../composables/use-navigation-menu'
import { NavigationMenuProvider } from '../composables/use-navigation-menu-context'

defineOptions({
  name: 'NavigationMenuRoot',
})

const props = withDefaults(defineProps<NavigationMenuRootProps>(), {
  disableClickTrigger: undefined,
  disableHoverTrigger: undefined,
  disablePointerLeaveClose: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<NavigationMenuRootEmits>()

const { api } = useNavigationMenu(props, emits)

NavigationMenuProvider(api)

useForwardExpose()
</script>

<template>
  <ui.nav v-bind="api.getRootProps()" :as-child="asChild">
    <slot />
  </ui.nav>
</template>
