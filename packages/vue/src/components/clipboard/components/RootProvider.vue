<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseClipboardReturn } from '../composables/use-clipboard'

interface RootProviderProps {
  value: UnwrapRef<UseClipboardReturn>
}

export interface ClipboardRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { ClipboardProvider } from '../composables/use-clipboard-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<ClipboardRootProviderProps>()
const clipboard = computed(() => props.value)

ClipboardProvider(clipboard)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="clipboard.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
