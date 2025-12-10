<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogTitleProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DialogTitle'
})

defineProps<DialogTitleProps>()
const dialog = useDialogContext()

useForwardExpose()
</script>

<template>
  <ui.h2 v-bind="dialog.getTitleProps()" :as-child="asChild">
    <slot />
  </ui.h2>
</template>
