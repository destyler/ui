<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface MenuTriggerItemProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'
import { useMenuTriggerItemContext } from '../composables/use-menu-trigger-item-context'

defineOptions({
  name: 'MenuTriggerItem'
})

defineProps<MenuTriggerItemProps>()
const triggerItemProps = useMenuTriggerItemContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="triggerItemProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
