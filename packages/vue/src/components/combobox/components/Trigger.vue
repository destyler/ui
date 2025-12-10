<script lang="ts">
import type { TriggerProps } from '@destyler/combobox'
import type { PolymorphicProps } from '~/factory'

export interface ComboboxTriggerProps extends TriggerProps, PolymorphicProps  {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'

defineOptions({
  name: 'ComboboxTrigger',
})

const props = defineProps<ComboboxTriggerProps>()
const combobox = useComboboxContext()
</script>

<template>
  <ui.button v-bind="combobox.getTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>
