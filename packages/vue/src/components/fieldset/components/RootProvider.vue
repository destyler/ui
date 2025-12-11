<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseFieldsetReturn } from '../composables/use-fieldset'

interface RootProviderProps {
  value: UnwrapRef<UseFieldsetReturn>
}

export interface FieldsetRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { FieldsetProvider } from '../composables/use-fieldset-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'FieldsetRootProvider',
})

const props = defineProps<FieldsetRootProviderProps>()
const fieldset = computed(() => props.value)

FieldsetProvider(fieldset)

useForwardExpose()
</script>

<template>
  <ui.fieldset v-bind="fieldset.getRootProps()" :as-child="asChild">
    <slot />
  </ui.fieldset>
</template>
