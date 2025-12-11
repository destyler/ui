<script lang="ts">
import { type PolymorphicProps } from '~/factory'

export interface MenuPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { PresenceProvider, usePresence } from '~/components/presence'
import { useMenuContext } from '../composables/use-menu-context'
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { computed } from 'vue'

defineOptions({
  name: 'MenuPositioner'
})

defineProps<MenuPositionerProps>()

const menu = useMenuContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: menu.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="menu.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
