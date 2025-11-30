<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ClipboardLabel'
})

defineProps<ClipboardLabelProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.label v-bind="clipboard.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
