<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface FieldRootProps extends RootProps, PolymorphicProps{}
</script>

<script setup lang="ts">
import { watch } from 'vue'
import { ui } from '~/factory'
import { useField } from '../composables/use-field'
import { FieldProvider } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldRoot'
})

const props = withDefaults(defineProps<FieldRootProps>(), {
  disabled: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const field = useField(props)
FieldProvider(field)

const { forwardRef, currentElement } = useForwardExpose()
watch(currentElement, (element, _previous, onCleanup) => {
  const rootRef = field.value.refs.rootRef
  rootRef.value = element ?? null
  onCleanup(() => {
    rootRef.value = null
  })
}, { flush: 'sync' })
</script>

<template>
  <ui.div :ref="forwardRef" v-bind="field.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
