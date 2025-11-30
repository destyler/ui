<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardValueTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineProps<ClipboardValueTextProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.span :as-child="asChild">
    <slot>{{ clipboard.value }}</slot>
  </ui.span>
</template>
