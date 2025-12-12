<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverIndicator'
})

defineProps<PopoverIndicatorProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="popover.getIndicatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
