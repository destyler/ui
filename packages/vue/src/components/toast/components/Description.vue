<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToastDescriptionProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToastContext } from '../composables/use-toast-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToastDescription'
})

defineProps<ToastDescriptionProps>()
const toast = useToastContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="toast.getDescriptionProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
