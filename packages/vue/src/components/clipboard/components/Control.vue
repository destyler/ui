<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ClipboardControl'
})

defineProps<ClipboardControlProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="clipboard.getControlProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
