<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface FieldRootProps extends RootProps, PolymorphicProps{}
</script>

<script setup lang="ts">
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

useForwardExpose()
</script>

<template>
  <ui.div v-bind="field.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
