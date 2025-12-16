<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface DynamicRootProps extends RootProps, PolymorphicProps {}
export interface DynamicRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamic } from '../composables/use-dynamic'
import { DynamicProvider } from '../composables/use-dynamic-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicRoot'
})

const props = withDefaults(defineProps<DynamicRootProps>(), {
  addOnPaste: undefined,
  allowOverflow: undefined,
  autoFocus: undefined,
  disabled: undefined,
  editable: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<DynamicRootEmits>()

const dynamic = useDynamic(props, emits)
DynamicProvider(dynamic)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="dynamic.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
