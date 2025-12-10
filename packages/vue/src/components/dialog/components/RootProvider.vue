<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { RenderStrategyProps } from '~/composables'
import type { UseDialogReturn } from '../composables/use-dialog'

interface RootProviderProps {
  value: UnwrapRef<UseDialogReturn>
}

export interface DialogRootProviderProps extends RootProviderProps, RenderStrategyProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider } from '~/composables'
import { DialogProvider } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DialogRootProvider'
})

const props = defineProps<DialogRootProviderProps>()
const dialog = computed(() => props.value)

DialogProvider(dialog)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>
