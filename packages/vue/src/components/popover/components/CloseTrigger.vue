<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverCloseTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverCloseTrigger'
})

defineProps<PopoverCloseTriggerProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="popover.getCloseTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
