<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface SwitchRootProps extends RootProps, PolymorphicProps {}
export interface SwitchRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSwitch } from '../composables/use-switch'
import { SwitchProvider } from '../composables/use-switch-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SwitchRoot',
})

const props = withDefaults(defineProps<SwitchRootProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  invalid: undefined,
  readOnly: undefined,
  required: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<SwitchRootEmits>()

const context = useSwitch(props, emits)
SwitchProvider(context)

useForwardExpose()
</script>

<template>
  <ui.label v-bind="context.getRootProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>
