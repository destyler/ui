<script lang="ts">
import type {  UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseCheckboxReturn } from '../composables/use-checkbox'

interface RootProviderProps {
  value: UnwrapRef<UseCheckboxReturn>
}

export interface CheckboxRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { CheckboxProvider } from '../composables/use-checkbox-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<CheckboxRootProviderProps>()
const checkbox = computed(() => props.value)

CheckboxProvider(checkbox)

useForwardExpose()
</script>

<template>
  <ui.label v-bind="checkbox.getRootProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
