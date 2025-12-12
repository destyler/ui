<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverArrowTipProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverArrowTip'
})

defineProps<PopoverArrowTipProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="popover.getArrowTipProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
