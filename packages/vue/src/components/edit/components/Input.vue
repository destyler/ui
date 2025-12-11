<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface EditInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useEditContext } from '../composables/use-edit-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'EditInput',
})

defineProps<EditInputProps>()
const edit = useEditContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="edit.getInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>
