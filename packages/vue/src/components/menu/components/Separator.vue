<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuSeparatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuSeparator'
})

defineProps<MenuSeparatorProps>()
const menu = useMenuContext()

useForwardExpose()
</script>

<template>
  <ui.hr v-bind="menu.getSeparatorProps()" :as-child="asChild">
    <slot />
  </ui.hr>
</template>
