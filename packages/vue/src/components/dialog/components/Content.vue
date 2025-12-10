<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { usePresenceContext } from '~/components/presence'

defineOptions({
  name: 'DialogContent'
})

defineProps<DialogContentProps>()

const dialog = useDialogContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(dialog.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>
