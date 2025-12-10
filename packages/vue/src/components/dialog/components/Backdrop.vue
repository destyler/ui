<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DialogBackdropProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useRenderStrategyProps, useForwardExpose } from '~/composables'
import { Presence } from '~/components/presence'
import { useDialogContext } from '../composables/use-dialog-context'

defineOptions({
  name: 'DialogBackdrop'
})

defineProps<DialogBackdropProps>()
const dialog = useDialogContext()
const renderStrategy = useRenderStrategyProps()

useForwardExpose()
</script>

<template>
  <Presence
    v-bind="dialog.getBackdropProps()"
    :present="dialog.open"
    :lazy-mount="renderStrategy.lazyMount"
    :unmount-on-exit="renderStrategy.unmountOnExit"
  >
    <slot />
  </Presence>
</template>
