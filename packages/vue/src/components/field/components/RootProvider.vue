<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseFieldReturn } from '../composables/use-field'

interface RootProviderProps {
  value: UnwrapRef<UseFieldReturn>
}

export interface FieldRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { FieldProvider } from '../composables/use-field-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<FieldRootProviderProps>()
const field = computed(() => props.value)

FieldProvider(field)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="field.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
