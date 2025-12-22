<script lang="ts">
import type { LinkProps } from '@destyler/navigation-menu'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuLinkProps extends LinkProps, PolymorphicProps {
  href?: string
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuLink',
})

const props = withDefaults(defineProps<NavigationMenuLinkProps>(), {
  active: undefined,
} satisfies BooleanDefaults<LinkProps>)

const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.a v-bind="navigationMenu.getLinkProps({ value: props.value, active: props.active })" :href="href" :as-child="asChild">
    <slot />
  </ui.a>
</template>
