<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogCloseTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DialogCloseTrigger'
})

defineProps<DialogCloseTriggerProps>()
const dialog = useDialogContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="dialog.getCloseTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
