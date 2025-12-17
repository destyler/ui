<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface ToggleRootProps extends RootProps, PolymorphicProps {}
export interface ToggleRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useToggle } from '../composables/use-toggle'
import { ToggleProvider } from '../composables/use-toggle-context'

defineOptions({
  name: 'ToggleRoot',
})

const props = withDefaults(defineProps<ToggleRootProps>(), {
  disabled: undefined,
  defaultPressed: undefined,
  modelValue: undefined,
} satisfies BooleanDefaults<RootProps>)

const emit = defineEmits<ToggleRootEmits>()

const toggle = useToggle(props, emit)

ToggleProvider(toggle)

useForwardExpose()
</script>

<template>
  <ui.button v-bind="toggle.getRootProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>
