<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogDescriptionProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DialogDescription'
})

defineProps<DialogDescriptionProps>()
const dialog = useDialogContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dialog.getDescriptionProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
