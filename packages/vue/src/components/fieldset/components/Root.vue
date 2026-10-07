<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface FieldsetRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { watch } from 'vue'
import { ui } from '~/factory'
import { useFieldset } from '../composables/use-fieldset'
import { FieldsetProvider } from '../composables/use-fieldset-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldsetRoot',
})

const props = withDefaults(defineProps<FieldsetRootProps>(), {
  disabled: undefined,
  invalid: undefined,
} satisfies BooleanDefaults<RootProps>)

const fieldset = useFieldset(props)
FieldsetProvider(fieldset)

const { forwardRef, currentElement } = useForwardExpose()
watch(currentElement, (element, _previous, onCleanup) => {
  const rootRef = fieldset.value.refs.rootRef
  rootRef.value = element ?? null
  onCleanup(() => {
    rootRef.value = null
  })
}, { flush: 'sync' })
</script>

<template>
  <ui.fieldset :ref="forwardRef" v-bind="fieldset.getRootProps()" :as-child="asChild">
    <slot />
  </ui.fieldset>
</template>
