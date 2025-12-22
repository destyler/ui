<script lang="ts">
import type { ContentProps } from '@destyler/navigation-menu'
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuContentProps extends ContentProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuContent',
})

const props = defineProps<NavigationMenuContentProps>()

const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="navigationMenu.getContentProps({ value: props.value })" :as-child="asChild">
    <slot />
  </ui.div>
</template>
