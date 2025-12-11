<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface FieldsetRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
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

useForwardExpose()
</script>

<template>
  <ui.fieldset v-bind="fieldset.getRootProps()" :as-child="asChild">
    <slot />
  </ui.fieldset>
</template>
