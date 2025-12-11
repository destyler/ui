<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuArrow'
})

defineProps<MenuArrowProps>()
const menu = useMenuContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="menu.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
