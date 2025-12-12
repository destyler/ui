<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverTrigger'
})

defineProps<PopoverTriggerProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="popover.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
