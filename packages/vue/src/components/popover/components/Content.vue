<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PopoverContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePopoverContext } from '../composables/use-popover-context'
import { useForwardExpose } from '~/composables'
import { usePresenceContext } from '~/components/presence'
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'

defineOptions({
  name: 'PopoverContent'
})

defineProps<PopoverContentProps>()

const popover = usePopoverContext()
const presence = usePresenceContext()

const mergedProps = computed(() => mergeProps(popover.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
