<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuTrigger'
})

defineProps<MenuTriggerProps>()
const menu = useMenuContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="menu.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
