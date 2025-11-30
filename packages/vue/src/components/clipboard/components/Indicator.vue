<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ClipboardIndicator'
})

defineProps<ClipboardIndicatorProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="clipboard.getIndicatorProps({ copied: clipboard.copied })" :as-child="asChild">
    <slot name="copied" v-if="clipboard.copied" />
    <slot v-else />
  </ui.div>
</template>
