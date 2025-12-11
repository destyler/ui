<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseEditReturn } from '../composables/use-edit'

interface RootProviderProps {
  value: UnwrapRef<UseEditReturn>
}

export interface EditRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { EditProvider } from '../composables/use-edit-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<EditRootProviderProps>()
const edit = computed(() => props.value)

EditProvider(edit)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="edit.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
