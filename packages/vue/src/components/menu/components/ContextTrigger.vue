<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuContextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuContextTrigger'
})

defineProps<MenuContextTriggerProps>()
const menu = useMenuContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="menu.getContextTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
