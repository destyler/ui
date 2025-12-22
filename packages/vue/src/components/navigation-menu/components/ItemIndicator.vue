<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface NavigationMenuItemIndicatorProps extends PolymorphicProps {
  value: string
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NavigationMenuItemIndicator',
})

defineProps<NavigationMenuItemIndicatorProps>()

useForwardExpose()
</script>

<template>
  <ui.span data-scope="navigation-menu" data-part="item-indicator" :as-child="asChild">
    <slot />
  </ui.span>
</template>
