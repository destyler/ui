<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ClipboardTrigger'
})

defineProps<ClipboardTriggerProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="clipboard.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
