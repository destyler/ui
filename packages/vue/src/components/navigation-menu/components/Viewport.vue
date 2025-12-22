<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuViewportProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { mergeProps } from '@destyler/vue'
import { ui } from '~/factory'
import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
import { usePresenceContext } from '~/components/presence'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuViewport',
})

defineProps<NavigationMenuViewportProps>()

const navigationMenu = useNavigationMenuContext()
const presence = usePresenceContext()

const mergedProps = computed(() => mergeProps(navigationMenu.value.getViewportProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
