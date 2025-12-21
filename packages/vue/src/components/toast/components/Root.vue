<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToastRootProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToastContext } from '../composables/use-toast-context'
import { useForwardExpose } from '~/composables'

defineProps<ToastRootProps>()

const toast = useToastContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="toast.getRootProps()" :as-child="asChild">
    <div v-bind="toast.getGhostBeforeProps()" />
    <slot />
    <div v-bind="toast.getGhostAfterProps()" />
  </ui.div>
</template>
