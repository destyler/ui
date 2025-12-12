<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverAnchorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverAnchor'
})

defineProps<PopoverAnchorProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="popover.getAnchorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
