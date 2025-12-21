<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToastActionTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToastContext } from '../composables/use-toast-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToastActionTrigger',
})

defineProps<ToastActionTriggerProps>()
const toast = useToastContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="toast.getActionTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
