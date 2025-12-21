<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToastCloseTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToastContext } from '../composables/use-toast-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToastCloseTrigger',
})

defineProps<ToastCloseTriggerProps>()
const toast = useToastContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="toast.getCloseTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
