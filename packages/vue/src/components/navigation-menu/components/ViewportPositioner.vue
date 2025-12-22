<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/composables'

export interface NavigationMenuViewportPositionerProps extends PolymorphicProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { PresenceProvider, usePresence } from '~/components/presence'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'

defineOptions({
  name: 'NavigationMenuViewportPositioner',
})

const props = defineProps<NavigationMenuViewportPositionerProps>()

const navigationMenu = useNavigationMenuContext()

const presence = usePresence(
  computed(() => ({
    lazyMount: props.lazyMount,
    unmountOnExit: props.unmountOnExit,
    present: navigationMenu.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="navigationMenu.getViewportPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
