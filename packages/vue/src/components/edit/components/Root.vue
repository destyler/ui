<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface EditRootProps extends RootProps, PolymorphicProps {}
export interface EditRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEdit } from '../composables/use-edit'
import { EditProvider } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditRoot',
})

const props = withDefaults(defineProps<EditRootProps>(), {
  autoResize: undefined,
  defaultEdit: undefined,
  disabled: undefined,
  edit: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
  selectOnFocus: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<EditRootEmits>()

const edit = useEdit(props, emits)
EditProvider(edit)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="edit.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
