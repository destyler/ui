<script lang="ts">
import type { TriggerProps } from '@destyler/navigation-menu'
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuTriggerProps extends TriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuTrigger',
})

const props = withDefaults(defineProps<NavigationMenuTriggerProps>(), {
  disabled: undefined,
} satisfies BooleanDefaults<TriggerProps>)

const navigationMenu = useNavigationMenuContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="navigationMenu.getTriggerProps({ value: props.value, disabled: props.disabled })" :as-child="asChild">
    <slot />
  </ui.button>
</template>
