<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DialogTrigger'
})

defineProps<DialogTriggerProps>()
const dialog = useDialogContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="dialog.getTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
