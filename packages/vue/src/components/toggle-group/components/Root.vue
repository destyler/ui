<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ToggleGroupRootProps extends RootProps, PolymorphicProps {}
export interface ToggleGroupRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToggleGroup } from '../composables/use-toggle-group'
import { ToggleGroupProvider } from '../composables/use-toggle-group-context'

defineOptions({
  name: 'ToggleGroupRoot'
})

const props = withDefaults(defineProps<ToggleGroupRootProps>(), {
  disabled: undefined,
  loopFocus: undefined,
  multiple: undefined,
  rovingFocus: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<ToggleGroupRootEmits>()

const toggleGroup = useToggleGroup(props, emits)
ToggleGroupProvider(toggleGroup)
</script>

<template>
  <ui.div v-bind="toggleGroup.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>
