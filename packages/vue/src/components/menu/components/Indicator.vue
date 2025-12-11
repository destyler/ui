<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuIndicator'
})

defineProps<MenuIndicatorProps>()
const menu = useMenuContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getIndicatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
