<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { RootEmits, RootProps } from '../types'

export interface DialogRootProps extends RootProps, RenderStrategyProps {}
export interface DialogRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { useDialog } from '../composables/use-dialog'
import { DialogProvider } from '../composables/use-dialog-context'

defineOptions({
  name: 'DialogRoot'
})

const props = withDefaults(defineProps<DialogRootProps>(), {
  closeOnEscape: undefined,
  closeOnInteractOutside: undefined,
  defaultOpen: undefined,
  modal: undefined,
  open: undefined,
  preventScroll: undefined,
  restoreFocus: undefined,
  trapFocus: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<DialogRootEmits>()
const dialog = useDialog(props, emits)

DialogProvider(dialog)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
