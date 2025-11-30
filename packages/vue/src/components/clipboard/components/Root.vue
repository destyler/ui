<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ClipboardRootProps extends RootProps, PolymorphicProps {}
export interface ClipboardRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useClipboard } from '../composables/use-clipboard'
import { ClipboardProvider } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<ClipboardRootProps>()
const emits = defineEmits<ClipboardRootEmits>()

const clipboard = useClipboard(props, emits)
ClipboardProvider(clipboard)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="clipboard.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
