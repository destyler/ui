<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ClipboardInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboardContext } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

defineProps<ClipboardInputProps>()
const clipboard = useClipboardContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="clipboard.getInputProps()" :as-child="asChild"><slot /></ui.input>
</template>
