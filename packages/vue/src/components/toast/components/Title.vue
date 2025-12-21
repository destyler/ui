<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ToastTitleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToastContext } from '../composables/use-toast-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToastTitle',
})

defineProps<ToastTitleProps>()
const toast = useToastContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="toast.getTitleProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
