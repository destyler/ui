<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverArrowProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverArrow'
})

defineProps<PopoverArrowProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="popover.getArrowProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
