<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverTitleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PopoverTitle'
})

defineProps<PopoverTitleProps>()
const popover = usePopoverContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="popover.getTitleProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
