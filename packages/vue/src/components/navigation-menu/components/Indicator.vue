<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RenderStrategyProps } from '~/composables'

export interface NavigationMenuIndicatorProps extends PolymorphicProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { PresenceProvider, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuIndicator',
})

const props = defineProps<NavigationMenuIndicatorProps>()
const navigationMenu = useNavigationMenuContext()

const presence = usePresence(
  computed(() => ({
    lazyMount: props.lazyMount,
    unmountOnExit: props.unmountOnExit,
    present: navigationMenu.value.open,
  })),
)
PresenceProvider(presence)

const mergedProps = computed(() => mergeProps(navigationMenu.value.getIndicatorProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
